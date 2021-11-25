#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$configurationsToTest = 'db.json', 'root.json', 'server.json'

return & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug
