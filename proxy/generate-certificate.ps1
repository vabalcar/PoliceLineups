#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoCertificateStore,
    [switch] $NoConfigurationValidation
)

$environment = $Debug ? 'debug' : 'production'
$proxyConfigurationFile = Join-Path '..' 'config' $environment 'proxy.json'
$isProxyConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $proxyConfigurationFile)
if (!$isProxyConfigurationValid) {
    exit
}

$proxyConfiguration = Get-Content $proxyConfigurationFile | ConvertFrom-Json
$proxyHost = $proxyConfiguration.host

if ($IsWindows -and !$NoCertificateStore) {
    $certLocation = 'Cert:\CurrentUser\My'

    if ((Get-ChildItem -Path $certLocation | Where-Object Subject -Eq "CN=$proxyHost" | Measure-Object).Count -gt 0) {
        "Cerificate for $proxyHost already exists" | Out-Host
        exit
    }

    New-SelfSignedCertificate -NotBefore (Get-Date) -NotAfter (Get-Date).AddYears(1) -Subject $proxyHost -KeyAlgorithm "RSA" -KeyLength 2048 -HashAlgorithm "SHA256" -CertStoreLocation $certLocation -KeyUsage KeyEncipherment -FriendlyName "My HTTPS development certificate" -TextExtension @("2.5.29.19={critical}{text}", "2.5.29.37={critical}{text}1.3.6.1.5.5.7.3.1", "2.5.29.17={critical}{text}DNS=localhost")
}
else {
    $certsDirectory = '.ssl'
    $certFile = Join-Path $certsDirectory "$proxyHost.crt"
    $certKeyFile = Join-Path $certsDirectory "$proxyHost.key"

    if ((Test-Path -PathType Leaf -Path $certFile) -and (Test-Path -PathType Leaf -Path $certKeyFile)) {
        "Cerificate for $proxyHost already exists" | Out-Host
        exit
    }

    if (!(Test-Path -PathType Container -Path $certsDirectory)) {
        New-Item -ItemType Directory -Path $certsDirectory | Out-Null
    }

    & openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out $certFile -keyout $certKeyFile -subj "/CN=$proxyHost"
}
