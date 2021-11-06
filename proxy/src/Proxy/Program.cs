static JsonElement ParseJsonFile(params string[] jsonFile)
    => JsonDocument.Parse(File.ReadAllText(Path.Combine(jsonFile))).RootElement;

static JsonElement? GetPropertyValue(JsonElement? jsonObject, string propertyName)
    => (jsonObject?.TryGetProperty(propertyName, out var jsonObjectProperty) ?? false) ? jsonObjectProperty : null;

static ClusterConfig CreateClusterConfig(string clusterId, string clusterAddress)
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

static X509Certificate2? GetCertificateOrDefault(dynamic? certConfiguration, string? host, bool isDevelopmentEnvironment)
    => GetCertificateFromFilesOrDefault(certConfiguration, host)
    ?? GetCertificateFromCertificateStoreOrDefault(host, isDevelopmentEnvironment);

static X509Certificate2? GetCertificateFromCertificateStoreOrDefault(string? host, bool isDevelopmentEnvironment)
{
    if (!OperatingSystem.IsWindows() || string.IsNullOrEmpty(host))
        return default;

    using var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
    store.Open(OpenFlags.ReadOnly);

    var foundCertificates = store.Certificates.Find(X509FindType.FindBySubjectName, host, validOnly: !isDevelopmentEnvironment);

    return foundCertificates.FirstOrDefault();
}

static X509Certificate2? GetCertificateFromFilesOrDefault(JsonElement? certConfiguration, string? host)
{
    var (certFile, certKeyFile) = GetCertificateFilePaths(certConfiguration, host);

    if (certFile is null || !File.Exists(certFile)
        || certKeyFile is null || !File.Exists(certKeyFile))
        return default;

    return new X509Certificate2(X509Certificate2.CreateFromPemFile(certFile, certKeyFile).Export(X509ContentType.Pkcs12));
}

static (string? certFile, string? certKeyFile) GetCertificateFilePaths(JsonElement? certConfiguration, string? host)
{
    string? certFile, certKeyFile;

    var os = OperatingSystem.IsWindows() ? "windows" : "linux";
    var certConfigurationForCurrentOS = GetPropertyValue(certConfiguration, os);
    certFile = GetPropertyValue(certConfigurationForCurrentOS, "certFile")?.GetString();
    certKeyFile = GetPropertyValue(certConfigurationForCurrentOS, "keyFile")?.GetString();

    if (certFile is null || certKeyFile is null)
    {
        const string certsDirectory = ".ssl";
        var isHostSet = host is not null;
        certFile = isHostSet ? Path.Combine(certsDirectory, $"{host}.crt") : default;
        certKeyFile = isHostSet ? Path.Combine(certsDirectory, $"{host}.key") : default;
    }

    return (certFile, certKeyFile);
}

var appBuilder = WebApplication.CreateBuilder(args);

var isDevelopmentEnvironment = appBuilder.Environment.IsDevelopment();
var environment = isDevelopmentEnvironment ? "debug" : "production";
var configurationDirectory = Path.Combine("..", "config", environment);

var certConfiguration = ParseJsonFile(configurationDirectory, "cert.json");
var clientConfiguration = ParseJsonFile(configurationDirectory, "client.json");
var proxyConfiguration = ParseJsonFile(configurationDirectory, "proxy.json");
var serverConfiguration = ParseJsonFile(configurationDirectory, "server.json");

var clientHost = GetPropertyValue(clientConfiguration, "host")?.GetString();
var clientPort = GetPropertyValue(clientConfiguration, "port")?.GetUInt16();

var proxyHost = GetPropertyValue(proxyConfiguration, "host")?.GetString();
var proxyHttpPort = GetPropertyValue(proxyConfiguration, "httpPort")?.GetUInt16();
var proxyHttpsPort = GetPropertyValue(proxyConfiguration, "httpsPort")?.GetUInt16();

var serverHost = GetPropertyValue(serverConfiguration, "host")?.GetString();
var serverPort = GetPropertyValue(serverConfiguration, "port")?.GetUInt16();

const string ClientClusterId = "Client";
const string ServerClusterId = "Server";

var clusters = new[]
{
    CreateClusterConfig(ClientClusterId, $"http://{clientHost}:{clientPort}"),
    CreateClusterConfig(ServerClusterId, $"http://{serverHost}:{serverPort}"),
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
        httpsConfiguration.ServerCertificate = GetCertificateOrDefault(certConfiguration, proxyHost, isDevelopmentEnvironment);
        httpsConfiguration.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls13;
    });
});

var app = appBuilder.Build();
app.MapReverseProxy();
app.UseHttpsRedirection();
app.Run();
