#!/usr/bin/pwsh
$apiConfig = Get-Content -Raw (Join-Path '..' 'api' 'api.json') | ConvertFrom-Json
$clientConfig = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json

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