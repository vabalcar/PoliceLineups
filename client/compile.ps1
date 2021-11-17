#!/usr/bin/pwsh
'Compiling client...' | Out-Host

$proxyConfigurationFile = Join-Path '..' 'config' 'production' 'proxy.json'
$isProxyConfigurationValid = & (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $proxyConfigurationFile
if (!$isProxyConfigurationValid) {
    exit
}

& npm run build -- --configuration production

'Client compiled' | Out-Host
