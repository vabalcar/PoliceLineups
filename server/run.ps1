#!/usr/bin/pwsh
Write-Host 'Running server...'
$packageInfo = Get-Content (Join-Path '.' 'package-info.json') | ConvertFrom-Json
$config = Get-Content (Join-Path '..' 'config' 'server.json') | ConvertFrom-Json
$venvName = $packageInfo.venvName

if ($IsWindows) {
    & (Join-Path "$venvName" 'Scripts' 'activate.ps1')
} else {
    & (Join-Path $venvName 'bin' 'activate.ps1')
}

$env:FLASK_RUN_HOST = $config.host
$env:FLASK_RUN_PORT = $config.port
& ($IsWindows ? 'python' : 'python3') app.py
& deactivate
Write-Host 'stopped.'