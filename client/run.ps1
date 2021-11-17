#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NonInteractive
)

'Running client...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$environmentCofigurationDirectory = Join-Path '..' 'config' $environment

$clientConfigurationFile = Join-Path $environmentCofigurationDirectory 'client.json'

$isClientConfigurationValid = & (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $clientConfigurationFile
if (!$isClientConfigurationValid) {
    exit
}

$clientConfiguration = Get-Content $clientConfigurationFile | ConvertFrom-Json

$inputRedirection = $NonInteractive ? '<', ($IsWindows ? 'nul' : '/dev/null') : @()

try {
    if ($Debug) {
        $proxyConfigurationFile = Join-Path $environmentCofigurationDirectory 'proxy.json'
        $isProxyConfigurationValid = & (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $proxyConfigurationFile
        if (!$isProxyConfigurationValid) {
            exit
        }

        & npm run debug -- --host $($clientConfiguration.host) --port $($clientConfiguration.port) @inputRedirection
    }
    else {
        & npm start -- (Join-Path 'dist' 'client')  -a $($clientConfiguration.host) -p $($clientConfiguration.port) --proxy "http://$($clientConfiguration.host):$($clientConfiguration.port)?" -d false --silent @inputRedirection
    }
}
finally {
    'Client stopped' | Out-Host
}
