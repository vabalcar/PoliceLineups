#!/usr/bin/pwsh
param (
    [switch] $NoConfigurationValidation
)

'Compiling client...' | Out-Host

$isConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '.' 'test-configuration.ps1') -ForCompile -PassThru)
if (!$isConfigurationValid) {
    exit
}

& npm run build -- --configuration production

'Client compiled' | Out-Host
