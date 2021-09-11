#!/usr/bin/pwsh
param (
    [string] $ModulesListFile = 'modules.txt'
)

Get-Content -Path  $ModulesListFile | ForEach-Object {
    "Installing $_..." | Out-Host
    Install-Module $_
}
