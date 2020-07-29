#!/usr/bin/pwsh
param (
    [switch] $Dev,
    [switch] $NoRun
)

$serverConfigFile = Join-Path '..' 'config' 'server.json'

if ($Dev) {
    . (Join-Path '..' 'pwsh' 'libs' 'json.ps1')
    $serverConfig = Update-JsonObject -Path $serverConfigFile -Attribute 'dev' -Value $true
} else {
    $serverConfig = Get-Content $serverConfigFile | ConvertFrom-Json
}

if ($NoRun) {
    exit
}

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