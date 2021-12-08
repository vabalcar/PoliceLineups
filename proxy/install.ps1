#!/usr/bin/pwsh
'Installing proxy...' | Out-Host

$targetProjectFile = (Join-Path 'src' 'Proxy' 'Proxy.csproj')
& dotnet restore $targetProjectFile

'Proxy installed' | Out-Host
