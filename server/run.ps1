#!/usr/bin/pwsh
param (
    [switch] $Debug
)

& (Join-Path '.' 'run-db.ps1')

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host

$originalWD = Get-Location
try {
    $env:FLASK_ENV = $Debug ? "development" : "production"
    if ($Debug) {
        Set-Location -Path 'src'
        python app_debug_runner.py
    }
    else {
        Set-Location -Path 'dist'
        $environment = $Debug ? 'debug' : 'production'
        $serverConfiguration = Get-Content (Join-Path '..' '..' 'config' $environment 'server.json') | ConvertFrom-Json
        & waitress-serve --host $serverConfiguration.host --port $serverConfiguration.port app:app
    }
}
finally {
    'Server stopped' | Out-Host
    & deactivate
    Set-Location -Path $originalWD
}
