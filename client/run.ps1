#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation,
    [switch] $NonInteractive
)

$isConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '.' 'test-configuration.ps1') -Debug:$Debug)
if (!$isConfigurationValid) {
    exit
}

'Running client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$clientConfigurationFile = Join-Path '..' 'config' $environment 'client.json'
$clientConfiguration = Get-Content $clientConfigurationFile | ConvertFrom-Json

$inputRedirection = $NonInteractive ? '<', ($IsWindows ? 'nul' : '/dev/null') : @()

try {
    if ($Debug) {
        & npm run debug -- --host $clientConfiguration.host --port $clientConfiguration.port @inputRedirection
    }
    else {
        & npm start -- (Join-Path 'dist' 'client')  -a $clientConfiguration.host -p $clientConfiguration.port --proxy "http://$($clientConfiguration.host):$($clientConfiguration.port)?" -d false --silent @inputRedirection
    }
}
finally {
    'Client stopped' | Out-Host
}
