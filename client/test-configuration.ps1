#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $ForCompile,
    [switch] $PassThru
)

$configurationsToTest = $ForCompile ? @() : @('client.json')
if ($Debug -or $ForCompile) {
    $configurationsToTest += @('proxy.json', 'root.json')
}

$allConfigurationsValid = & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug -PassThru

if ($PassThru) {
    return $allConfigurationsValid
}
