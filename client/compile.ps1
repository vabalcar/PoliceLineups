#!/usr/bin/pwsh
param (
    [switch] $NoConfigurationValidation
)

'Compiling client...' | Out-Host

$proxyConfigurationFile = Join-Path '..' 'config' 'production' 'proxy.json'
$isProxyConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $proxyConfigurationFile)
if (!$isProxyConfigurationValid) {
    exit
}

& npm run build -- --configuration production

'Client compiled' | Out-Host
