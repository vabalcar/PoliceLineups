#!/usr/bin/pwsh
& (Join-Path '.' 'activate.ps1')

'Installing dependencies...' | Out-Host
& pip install -r requirements.txt
'done.' | Out-Host

& deactivate