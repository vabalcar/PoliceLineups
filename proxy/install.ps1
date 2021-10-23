#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Installing proxy...' | Out-Host
$targetProjectFile = (Join-Path '.' 'src' 'Proxy' 'Proxy.csproj')
& dotnet restore $targetProjectFile
'done.' | Out-Host
