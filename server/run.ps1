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
