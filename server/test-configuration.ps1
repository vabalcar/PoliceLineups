#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$configurationsToTest = 'auth.json', 'db.json', 'root.json', 'server.json'

return & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug
