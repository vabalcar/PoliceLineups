#!/usr/bin/pwsh
param (
    [switch] $Dev,
    [switch] $NoRun
)

$clientConfigFile = Join-Path '..' 'config' 'client.json'

if ($Dev) {
    . (Join-Path '..' 'pwsh' 'libs' 'json.ps1')
    $clientConfig = Update-JsonObject -Path $clientConfigFile -Attribute 'dev' -Value $true
} else {
    $clientConfig = Get-Content $clientConfigFile | ConvertFrom-Json
}

if ($NoRun) {
    exit
}

$apiConfig = Get-Content -Raw (Join-Path '..' 'api' 'api.json') | ConvertFrom-Json

'Running client...' | Out-Host
try {
    if ($clientConfig.dev) {
        & ng serve --host $($clientConfig.host) --port $($clientConfig.port)
    } else {
        $clientOutPort = $clientConfig.outPort -eq 80 ? '' : ":${$clientConfig.outPort}"
        $publicHost = "$($apiConfig.schemes[0])://$($clientConfig.outHost)$($clientOutPort)$($clientConfig.outBasePath)/"
        & ng serve --host $($clientConfig.host) --port $($clientConfig.port) --publicHost=$publicHost
    }
} finally {
    'stopped.' | Out-Host
}