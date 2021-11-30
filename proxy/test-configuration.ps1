#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $PassThru
)

$configurationsToTest = 'cert.json', 'client.json', 'proxy.json', 'server.json'

$allConfigurationsValid = & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug -PassThru

if ($PassThru) {
    return $allConfigurationsValid
}
