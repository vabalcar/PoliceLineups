#!/usr/bin/pwsh
param (
    [string[]] $Configurations = $null,
    [switch] $Debug,
    [switch] $PassThru
)

$environment = $Debug ? 'debug' : 'production'

if ($Configurations) {
    "Testing configurations $($Configurations | Join-String -Separator ', ') of environment '$environment'..." | Out-Host
}
else {
    "Testing all configurations of environment '$environment'..." | Out-Host
}

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

if ($allConfigurationsValid) {
    'All tested configurations are valid' | Out-Host
}

if ($PassThru) {
    return $allConfigurationsValid
}
