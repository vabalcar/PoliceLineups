#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

$isConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '.' 'test-configuration.ps1') -Debug:$Debug -PassThru)
if (!$isConfigurationValid) {
    exit
}

$isDbRunning = & (Join-Path '.' 'run-db.ps1') -Debug:$Debug -NoConfigurationValidation -PassThru
if (!$isDbRunning) {
    Write-Host -ForegroundColor Red "DB is not running, so the server can not be run"
    exit
}

'Running server...' | Out-Host

& (Join-Path '.' 'activate.ps1')

$environment = $Debug ? 'debug' : 'production'
$serverConfigurationFile = Join-Path '..' 'config' $environment 'server.json'

$originalWD = Get-Location
try {
    $env:FLASK_ENV = $Debug ? "development" : "production"
    if ($Debug) {
        Set-Location -Path 'src'
        python app_debug_runner.py
    }
    else {
        $serverConfiguration = Get-Content $serverConfigurationFile | ConvertFrom-Json
        Set-Location -Path 'dist'
        & waitress-serve --host $serverConfiguration.host --port $serverConfiguration.port app:app
    }
}
finally {
    Set-Location -Path $originalWD
    & deactivate
    'Server stopped' | Out-Host
}
