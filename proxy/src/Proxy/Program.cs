dynamic? ParseJsonFile(params string[] jsonFile)
    => JsonSerializer.Deserialize<ExpandoObject>(File.ReadAllText(Path.Combine(jsonFile)));

ClusterConfig CreateClusterConfig(string clusterId, string clusterAddress)
    => new ClusterConfig
    {
        ClusterId = clusterId,
        Destinations = new Dictionary<string, DestinationConfig>(StringComparer.OrdinalIgnoreCase)
        {
            {
                $"{clusterId}-destination",
                new DestinationConfig
                {
                    Address = clusterAddress
                }
            }
        }
    };

X509Certificate2? GetCertificateOrDefault(string? host, bool isDevelopmentEnvironment)
{
    var certificate = GetCertificateFromCertsDirectoryOrDefault(host);
    return certificate ?? GetCertificateFromCertificateStoreOrDefault(host, isDevelopmentEnvironment);
}

X509Certificate2? GetCertificateFromCertificateStoreOrDefault(string? host, bool isDevelopmentEnvironment)
{
    if (!OperatingSystem.IsWindows() || string.IsNullOrEmpty(host))
        return default;

    using var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
    store.Open(OpenFlags.ReadOnly);

    var foundCertificates = store.Certificates.Find(X509FindType.FindBySubjectName, host, validOnly: !isDevelopmentEnvironment);

    return foundCertificates.FirstOrDefault();
}

X509Certificate2? GetCertificateFromCertsDirectoryOrDefault(string? host)
{
    if (string.IsNullOrEmpty(host))
        return default;

    const string certsDirectory = ".ssl";
    var certFile = Path.Combine(certsDirectory, $"{host}.crt");
    var certKeyFile = Path.Combine(certsDirectory, $"{host}.key");

    if (!File.Exists(certFile) || !File.Exists(certKeyFile))
        return default;

    return new X509Certificate2(X509Certificate2.CreateFromPemFile(certFile, certKeyFile).Export(X509ContentType.Pkcs12));
}

var appBuilder = WebApplication.CreateBuilder(args);

var environment = appBuilder.Environment.IsDevelopment() ? "debug" : "production";
var configurationDirectory = Path.Combine("..", "config", environment);

var clientConfiguration = ParseJsonFile(configurationDirectory, "client.json");
var proxyConfiguration = ParseJsonFile(configurationDirectory, "proxy.json");
var serverConfiguration = ParseJsonFile(configurationDirectory, "server.json");

var proxyHost = $"{proxyConfiguration?.host}";

const string ClientClusterId = "Client";
const string ServerClusterId = "Server";

var clusters = new[]
{
    CreateClusterConfig(ClientClusterId, $"http://{clientConfiguration?.host}:{clientConfiguration?.port}"),
    CreateClusterConfig(ServerClusterId, $"http://{serverConfiguration?.host}:{serverConfiguration?.port}"),
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
    $"http://{proxyHost}:{proxyConfiguration?.httpPort}",
    $"https://{proxyHost}:{proxyConfiguration?.httpsPort}"
);

appBuilder.WebHost.ConfigureKestrel(kestrelOptions =>
{
    kestrelOptions.ConfigureEndpointDefaults(endpointCOnfiguration =>
    {
        endpointCOnfiguration.Protocols = HttpProtocols.Http1;
    });
    kestrelOptions.ConfigureHttpsDefaults(httpsConfiguration =>
    {
        httpsConfiguration.ServerCertificate = GetCertificateOrDefault(proxyHost, appBuilder.Environment.IsDevelopment());
        httpsConfiguration.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
    });
});

var app = appBuilder.Build();
app.MapReverseProxy();
app.UseHttpsRedirection();
app.Run();
