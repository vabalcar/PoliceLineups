#!/usr/bin/pwsh
$apiConfig = Get-Content (Join-Path '..' 'api' 'api.json') | ConvertFrom-Json
$clientConfig = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json

if ($clientConfig.outPort -eq 80) { $clientConfig.outPort = '' }
else { $clientConfig.outPort = ":${$clientConfig.outPort}" }
$publicHost = "$($apiConfig.schemes[0])://$($clientConfig.outHost)$($clientConfig.outPort)$($clientConfig.outBasePath)/"

'Running client...' | Out-Host
try {
    & ng serve --host $($clientConfig.host) --port $($clientConfig.port) --publicHost=$publicHost
} finally {
    'stopped.' | Out-Host
}