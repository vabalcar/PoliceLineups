#!/usr/bin/pwsh
param (
    [switch] $Debug
)

$configurationsToTest = @('client.json')
if ($Debug) {
    $configurationsToTest += @('proxy.json')
}

return & (Join-Path '..' 'config' 'test-all.ps1') -Configurations $configurationsToTest -Debug:$Debug
