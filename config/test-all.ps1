#!/usr/bin/pwsh
param (
    [string[]] $Configurations = $null,
    [switch] $Debug,
    [switch] $PassThru
)

$environment = $Debug ? 'debug' : 'production'

if ($Configurations) {
    $configurationsOutputString = $Configurations | Join-String -Separator ', '
    "Testing configurations $configurationsOutputString of environment '$environment'..." | Out-Host
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
    if ($configurationsOutputString) {
        "Configurations $configurationsOutputString of environment '$environment' are valid" | Out-Host
    }
    else {
        "All configurations of environment '$environment' are valid" | Out-Host
    }
}

if ($PassThru) {
    return $allConfigurationsValid
}
