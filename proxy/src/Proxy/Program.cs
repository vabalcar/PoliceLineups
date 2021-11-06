var appBuilder = WebApplication.CreateBuilder(args);

var isDevelopmentEnvironment = appBuilder.Environment.IsDevelopment();
var environment = isDevelopmentEnvironment ? "debug" : "production";
var configurationDirectory = Path.Combine("..", "config", environment);

var certConfiguration = Json.ParseJsonFile(configurationDirectory, "cert.json");
var clientConfiguration = Json.ParseJsonFile(configurationDirectory, "client.json");
var proxyConfiguration = Json.ParseJsonFile(configurationDirectory, "proxy.json");
var serverConfiguration = Json.ParseJsonFile(configurationDirectory, "server.json");

var clientHost = Json.GetPropertyValue(clientConfiguration, "host")?.GetString();
var clientPort = Json.GetPropertyValue(clientConfiguration, "port")?.GetUInt16();

var proxyHost = Json.GetPropertyValue(proxyConfiguration, "host")?.GetString();
var proxyHttpPort = Json.GetPropertyValue(proxyConfiguration, "httpPort")?.GetUInt16();
var proxyHttpsPort = Json.GetPropertyValue(proxyConfiguration, "httpsPort")?.GetUInt16();

var serverHost = Json.GetPropertyValue(serverConfiguration, "host")?.GetString();
var serverPort = Json.GetPropertyValue(serverConfiguration, "port")?.GetUInt16();

const string ClientClusterId = "Client";
const string ServerClusterId = "Server";

var clusters = new[]
{
    Utils.CreateClusterConfig(ClientClusterId, $"http://{clientHost}:{clientPort}"),
    Utils.CreateClusterConfig(ServerClusterId, $"http://{serverHost}:{serverPort}"),
};

var routes = new[]
{
    new RouteConfig
    {
        RouteId = "ClientRoute",
        ClusterId = ClientClusterId,
        Match = new RouteMatch
        {
            Path = "{**catch-all}"
        }
    },
    new RouteConfig
    {
        RouteId = "ServerRoute",
        ClusterId = ServerClusterId,
        Match = new RouteMatch
        {
            Path = "/api/{**catch-all}"
        },
        Transforms = new[]
        {
            new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "PathRemovePrefix", "/api" }
            }
        }
    }
};

appBuilder.Services.AddReverseProxy().LoadFromMemory(routes, clusters);

appBuilder.WebHost.UseUrls(
    $"http://{proxyHost}:{proxyHttpPort}",
    $"https://{proxyHost}:{proxyHttpsPort}"
);

appBuilder.WebHost.ConfigureKestrel(kestrelOptions =>
{
    kestrelOptions.ConfigureEndpointDefaults(endpointCOnfiguration =>
    {
        endpointCOnfiguration.Protocols = HttpProtocols.Http1;
    });
    kestrelOptions.ConfigureHttpsDefaults(httpsConfiguration =>
    {
        httpsConfiguration.ServerCertificate = Ssl.GetCertificateOrDefault(certConfiguration, proxyHost, isDevelopmentEnvironment);
        httpsConfiguration.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
    });
});

var app = appBuilder.Build();
app.MapReverseProxy();
app.UseHttpsRedirection();
app.Run();
