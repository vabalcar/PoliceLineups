#!/usr/bin/pwsh
param (
    [ValidateSet('Docker', 'Service')] [string] $Mode = 'Docker',
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $PassThru
)

'Running DB...' | Out-Host

$commonArgs = @{
    Debug                     = $Debug
    NoConfigurationValidation = $NoConfigurationValidation
    PassThru                  = $true
}

switch ($Mode) {
    'Docker' {
        $result = & (Join-Path $PSScriptRoot 'run-in-docker.ps1') @commonArgs
    }
    'Service' {
        $result = & (Join-Path $PSScriptRoot 'run-local-db-service.ps1') @commonArgs
    }
}

if ($PassThru) {
    return $result
}
