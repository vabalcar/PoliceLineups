#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$isConfigurationValid = & (Join-Path '.' 'test-configuration.ps1') -Debug:$Debug
if (!$isConfigurationValid) {
    exit
}

. (Join-Path '..' 'utils' 'tasks.ps1')

Invoke-BuildAndRun -Debug:$Debug -NoConfigurationValidation
