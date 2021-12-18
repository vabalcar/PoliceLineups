#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $PassThru
)

$configurationsToTest = 'auth.json', 'db.json', 'root.json', 'rootForServer.json', 'server.json'

$allConfigurationsValid = & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug -PassThru

if ($PassThru) {
    return $allConfigurationsValid
}
