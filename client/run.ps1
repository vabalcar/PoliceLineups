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
    if ($Debug) {
        & npm run debug -- --host $($clientConfiguration.host) --port $($clientConfiguration.port) @inputRedirection
    }
    else {
        & npm start -- (Join-Path 'dist' 'client')  -a $($clientConfiguration.host) -p $($clientConfiguration.port) --proxy "http://$($clientConfiguration.host):$($clientConfiguration.port)?" -d false --silent @inputRedirection
    }
}
finally {
    'Client stopped' | Out-Host
}
