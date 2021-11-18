#!/usr/bin/pwsh
param (
    [switch] $Debug
)

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

return $allConfigurationsValid
