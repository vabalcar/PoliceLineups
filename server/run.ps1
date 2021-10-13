#!/usr/bin/pwsh
param (
    [switch] $Debug
)

& (Join-Path '.' 'run-db.ps1')

& (Join-Path '.' 'activate.ps1')

'Running server...' | Out-Host
$originalWD = Get-Location
try {
    Set-Location -Path 'src'
    if ($Debug) {
        & python app.py --debug
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
