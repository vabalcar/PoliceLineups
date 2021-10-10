#!/usr/bin/pwsh
param (
    [switch] $Dev,
    [switch] $NoRun
)

. (Join-Path '..' 'pwsh' 'libs' 'json.ps1')

$serverConfigFile = Join-Path '..' 'config' 'server.json'
Update-JsonObject -Path $serverConfigFile -Attribute 'dev' -Value $Dev | Out-Null

if ($NoRun) {
    exit
}

& (Join-Path '.' 'run-db.ps1')

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host
$originalWD = Get-Location
try {
    Set-Location -Path 'src'
    & python 'app.py'
}
finally {
    'stopped.' | Out-Host
    & deactivate
    Set-Location -Path $originalWD
}
