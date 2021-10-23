#!/usr/bin/pwsh
param (
    [switch] $Debug
)

'Running client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$clientConfiguration = Get-Content (Join-Path '..' 'config' $environment 'client.json') | ConvertFrom-Json

try {
    & npm run-script start -- --host $($clientConfiguration.host) --port $($clientConfiguration.port)
}
finally {
    'stopped.' | Out-Host
}
