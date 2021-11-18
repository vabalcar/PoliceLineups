#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

'Running proxy...' | Out-Host

$isConfigurationValid = & (Join-Path '.' 'test-configuration.ps1') -Debug:$Debug
if (!$isConfigurationValid) {
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
