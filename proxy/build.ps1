#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Building proxy...' | Out-Host
$targetProjetFile = (Join-Path '.' 'src' 'Proxy' 'Proxy.csproj')
& dotnet build --nologo $targetProjetFile /property:GenerateFullPaths=true /consoleloggerparameters:NoSummary
'done.' | Out-Host
