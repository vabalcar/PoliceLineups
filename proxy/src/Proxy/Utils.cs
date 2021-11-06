namespace PoliceLineups.Utils
{

    public static class Json
    {
        public static JsonElement ParseJsonFile(params string[] jsonFile)
            => JsonDocument.Parse(File.ReadAllText(Path.Combine(jsonFile))).RootElement;

        public static JsonElement? GetPropertyValue(JsonElement? jsonObject, string propertyName)
            => (jsonObject?.TryGetProperty(propertyName, out var jsonObjectProperty) ?? false) ? jsonObjectProperty : null;
    }

    public static class Ssl
    {
        public static X509Certificate2? GetCertificateOrDefault(dynamic? certConfiguration, string? host, bool isDevelopmentEnvironment)
            => GetCertificateFromFilesOrDefault(certConfiguration, host)
            ?? GetCertificateFromCertificateStoreOrDefault(host, isDevelopmentEnvironment);

        private static X509Certificate2? GetCertificateFromCertificateStoreOrDefault(string? host, bool isDevelopmentEnvironment)
        {
            if (!OperatingSystem.IsWindows() || string.IsNullOrEmpty(host))
                return default;

            using var store = new X509Store(StoreName.My, StoreLocation.CurrentUser);
            store.Open(OpenFlags.ReadOnly);

            var foundCertificates = store.Certificates.Find(X509FindType.FindBySubjectName, host, validOnly: !isDevelopmentEnvironment);

            return foundCertificates.FirstOrDefault();
        }

        private static X509Certificate2? GetCertificateFromFilesOrDefault(JsonElement? certConfiguration, string? host)
        {
            var (certFile, certKeyFile) = GetCertificateFilePaths(certConfiguration, host);

            if (certFile is null || !File.Exists(certFile)
                || certKeyFile is null || !File.Exists(certKeyFile))
                return default;

            return new X509Certificate2(X509Certificate2.CreateFromPemFile(certFile, certKeyFile).Export(X509ContentType.Pkcs12));
        }

        private static (string? certFile, string? certKeyFile) GetCertificateFilePaths(JsonElement? certConfiguration, string? host)
        {
            string? certFile, certKeyFile;

            var os = OperatingSystem.IsWindows() ? "windows" : "linux";
            var certConfigurationForCurrentOS = Json.GetPropertyValue(certConfiguration, os);
            certFile = Json.GetPropertyValue(certConfigurationForCurrentOS, "certFile")?.GetString();
            certKeyFile = Json.GetPropertyValue(certConfigurationForCurrentOS, "keyFile")?.GetString();

            if (certFile is null || certKeyFile is null)
            {
                const string certsDirectory = ".ssl";
                var isHostSet = host is not null;
                certFile = isHostSet ? Path.Combine(certsDirectory, $"{host}.crt") : default;
                certKeyFile = isHostSet ? Path.Combine(certsDirectory, $"{host}.key") : default;
            }

            return (certFile, certKeyFile);
        }
    }

    public static class Utils
    {
        public static ClusterConfig CreateClusterConfig(string clusterId, string clusterAddress)
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
    }
}
