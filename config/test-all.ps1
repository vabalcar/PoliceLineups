#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [string[]] $Configurations = $null
)

$environment = $Debug ? 'debug' : 'production'
$environmentCofigurationDirectory = Join-Path $PSScriptRoot $environment
$Configurations ??= Get-ChildItem -Name -Path (Join-Path $PSScriptRoot $environment '*') -Include '*.json'

$allConfigurationsValid = $true

$Configurations | ForEach-Object {
    $configurationFile = Join-Path $environmentCofigurationDirectory $_
    $isConfigurationValid = & (Join-Path $PSScriptRoot 'test.ps1') -PassThru -ConfigurationFile $configurationFile
    if (!$isConfigurationValid -and $allConfigurationsValid) {
        $allConfigurationsValid = $false
    }
}

return $allConfigurationsValid
