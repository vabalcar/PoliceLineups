#!/usr/bin/pwsh
param (
    [switch] $Dev
)

& (Join-Path '.' 'run-db.ps1')

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host
$originalWD = Get-Location
try {
    Set-Location -Path 'src'
    if ($Dev) {
        & python app.py --dev
    }
    else {
        & python app.py
    }
}
finally {
    'stopped.' | Out-Host
    & deactivate
    Set-Location -Path $originalWD
}
