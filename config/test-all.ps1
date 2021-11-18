#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$environment = $Debug ? 'debug' : 'production'

$allConfigurationsValid = $true

Get-ChildItem -Path (Join-Path $PSScriptRoot $environment '*') -Include '*.json' | ForEach-Object {
    $isConfigurationValid = & (Join-Path '.' 'test.ps1') -PassThru -ConfigurationFile $_
    if (!$isConfigurationValid -and $allConfigurationsValid) {
        $allConfigurationsValid = $false
    }
}

return $allConfigurationsValid
