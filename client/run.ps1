#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NonInteractive
)

'Running client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$clientConfiguration = Get-Content (Join-Path '..' 'config' $environment 'client.json') | ConvertFrom-Json

try {
    if ($Debug) {
        $inputRedirection = $NonInteractive ? '<', ($IsWindows ? 'nul' : '/dev/null') : @()
        & npm run debug -- --host $($clientConfiguration.host) --port $($clientConfiguration.port) @inputRedirection
    }
    else {
        & npm run build -- --configuration production
        & npm start -- (Join-Path 'dist' 'client')  -a $($clientConfiguration.host) -p $($clientConfiguration.port) --proxy "http://$($clientConfiguration.host):$($clientConfiguration.port)?" -d false
    }
}
finally {
    'stopped.' | Out-Host
}
