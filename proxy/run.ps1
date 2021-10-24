#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running proxy...' | Out-Host

$env:ASPNETCORE_ENVIRONMENT = $Debug ? 'Development' : 'Production'
& dotnet (Join-Path 'src' 'Proxy' 'bin' 'Debug' 'net6.0' 'Proxy.dll')
