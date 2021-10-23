#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Building proxy...' | Out-Host
$targetProjectFile = (Join-Path '.' 'src' 'Proxy' 'Proxy.csproj')
& dotnet build --nologo $targetProjectFile /property:GenerateFullPaths=true /consoleloggerparameters:NoSummary
'done.' | Out-Host
