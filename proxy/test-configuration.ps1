#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$configurationsToTest = 'cert.json', 'client.json', 'proxy.json', 'server.json'

return & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug
