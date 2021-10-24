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

var configurationDirectory = Path.Combine("..", "config", "debug");

var clientConfiguration = ParseJsonFile(configurationDirectory, "client.json");
var proxyConfiguration = ParseJsonFile(configurationDirectory, "proxy.json");
var serverConfiguration = ParseJsonFile(configurationDirectory, "server.json");

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

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy().LoadFromMemory(routes, clusters);

var app = builder.Build();
app.MapReverseProxy();
app.Run();
