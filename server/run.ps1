#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $NoConfigurationValidation
)

$isDbRunning = & (Join-Path '.' 'run-db.ps1') -PassThru -Debug:$Debug
if (!$isDbRunning) {
    Write-Host -ForegroundColor Red "DB is not running, so the server can not be started"
    exit
}

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host

$environment = $Debug ? 'debug' : 'production'
$serverConfigurationFile = Join-Path '..' 'config' $environment 'server.json'

$isServerConfigurationValid = $NoConfigurationValidation -or (& (Join-Path '..' 'config' 'test.ps1') -PassThru -ConfigurationFile $serverConfigurationFile)
if (!$isServerConfigurationValid) {
    exit
}

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
