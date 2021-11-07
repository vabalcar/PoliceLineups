#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running proxy...' | Out-Host

$env:ASPNETCORE_ENVIRONMENT = $Debug ? 'Development' : 'Production'

if ($Debug) {
    & dotnet (Join-Path 'src' 'Proxy' 'bin' 'Debug' 'net6.0' 'Proxy.dll')
}
else {
    & dotnet (Join-Path 'src' 'Proxy' 'bin' 'Debug' 'net6.0' 'publish' 'Proxy.dll')
}
