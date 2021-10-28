#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NonInteractive
)

'Running client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$clientConfiguration = Get-Content (Join-Path '..' 'config' $environment 'client.json') | ConvertFrom-Json

$inputRedirection = $NonInteractive ? '<', ($IsWindows ? 'nul' : '/dev/null') : @()

try {
    & npm start -- --host $($clientConfiguration.host) --port $($clientConfiguration.port) @inputRedirection
}
finally {
    'stopped.' | Out-Host
}
