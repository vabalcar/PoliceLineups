#!/usr/bin/pwsh
$serverConfig = Get-Content (Join-Path '..' 'serverConfig' 'server.json') | ConvertFrom-Json

& (Join-Path '.' 'activate.ps1')

$env:FLASK_RUN_HOST = $serverConfig.host
$env:FLASK_RUN_PORT = $serverConfig.port

'Running server...' | Out-Host
try {
    & python (Join-Path 'src' 'app.py')
} finally {
    'stopped.' | Out-Host
    & deactivate
}