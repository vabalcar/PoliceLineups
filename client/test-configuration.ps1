#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $PassThru
)

$configurationsToTest = @('client.json')
if ($Debug) {
    $configurationsToTest += @('proxy.json')
}

$allConfigurationsValid = & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug -PassThru

if ($PassThru) {
    return $allConfigurationsValid
}
