#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running proxy...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$environmentCofigurationDirectory = Join-Path '..' 'config' $environment

$allConfigurationsValid = $true

'cert.json', 'client.json', 'proxy.json', 'server.json' | ForEach-Object {
    $configurationFile = Join-Path $environmentCofigurationDirectory $_
    $isConfigurationValid = & (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $configurationFile
    if (!$isConfigurationValid -and $allConfigurationsValid) {
        $allConfigurationsValid = $false
    }
}

if (!$allConfigurationsValid) {
    exit
}

$env:ASPNETCORE_ENVIRONMENT = $Debug ? 'Development' : 'Production'

if ($Debug) {
    & dotnet (Join-Path 'src' 'Proxy' 'bin' 'Debug' 'net6.0' 'Proxy.dll')
}
else {
    & dotnet (Join-Path 'dist' 'Proxy.dll')
}

'Proxy stopped' | Out-Host
