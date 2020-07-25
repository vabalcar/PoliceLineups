#!/usr/bin/pwsh
$config = Get-Content (Join-Path '..' 'config' 'server.json') | ConvertFrom-Json

& (Join-Path '.' 'activate.ps1')

$env:FLASK_RUN_HOST = $config.host
$env:FLASK_RUN_PORT = $config.port

'Running server...' | Out-Host
try {
    & python app.py
} finally {
    'stopped.' | Out-Host
    & deactivate
}