$apiConfig = Get-Content (Join-Path '..' 'api' 'api.json') | ConvertFrom-Json
$clientConfig = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json

if ($clientConfig.outPort -eq 80) { $clientConfig.outPort = '' }
else { $clientConfig.outPort = ":${$clientConfig.outPort}" }

Write-Host 'Running client...'

$publicHost = "$($apiConfig.schemes[0])://$($clientConfig.outHost)$($clientConfig.outPort)$($clientConfig.outBasePath)/"
& ng serve --open --host $($clientConfig.host) --port $($clientConfig.port) --publicHost=$publicHost

Write-Host 'stopped.'