#!/usr/bin/pwsh
param (
    [switch] $Debug
)

& (Join-Path '.' 'run-db.ps1')

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host

$originalWD = Get-Location
Set-Location -Path 'src'

try {
    $env:FLASK_ENV = $Debug ? "development" : "production"
    if ($Debug) {
        python app_debug_runner.py
    }
    else {
        $environment = $Debug ? 'debug' : 'production'
        $serverConfiguration = Get-Content (Join-Path '..' '..' 'config' $environment 'server.json') | ConvertFrom-Json
        & waitress-serve --host $serverConfiguration.host --port $serverConfiguration.port app:app
    }
}
finally {
    'stopped.' | Out-Host
    & deactivate
    Set-Location -Path $originalWD
}
