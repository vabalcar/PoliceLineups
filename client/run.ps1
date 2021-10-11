#!/usr/bin/pwsh
param (
    [switch] $Dev
)

'Running client...' | Out-Host

$clientConfig = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json

try {
    if ($Dev) {
        & ng serve --host $($clientConfig.host) --port $($clientConfig.port)
    }
    else {
        $clientOutPort = $clientConfig.outPort -eq 80 ? '' : ":${$clientConfig.outPort}"
        $publicHost = "$($clientConfig.schema)://$($clientConfig.outHost)$($clientOutPort)$($clientConfig.outBasePath)/"
        & ng serve --host $($clientConfig.host) --port $($clientConfig.port) --publicHost=$publicHost --configuration production
    }
}
finally {
    'stopped.' | Out-Host
}
