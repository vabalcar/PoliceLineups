#!/usr/bin/pwsh
$environment = $Debug ? 'debug' : 'production'
$proxyConfiguration = Get-Content (Join-Path '..' 'config' $environment 'proxy.json') | ConvertFrom-Json

if ($IsWindows) {
    $certLocation = 'Cert:\CurrentUser\My'

    if ((Get-ChildItem -Path $certLocation | Where-Object Subject -Eq "CN=$($proxyConfiguration.host)" | Measure-Object).Count -gt 0) {
        "Cerificate for $($proxyConfiguration.host) already exists" | Out-Host
        exit
    }

    New-SelfSignedCertificate -NotBefore (Get-Date) -NotAfter (Get-Date).AddYears(1) -Subject $proxyConfiguration.host -KeyAlgorithm "RSA" -KeyLength 2048 -HashAlgorithm "SHA256" -CertStoreLocation $certLocation -KeyUsage KeyEncipherment -FriendlyName "My HTTPS development certificate" -TextExtension @("2.5.29.19={critical}{text}", "2.5.29.37={critical}{text}1.3.6.1.5.5.7.3.1", "2.5.29.17={critical}{text}DNS=localhost")
}
