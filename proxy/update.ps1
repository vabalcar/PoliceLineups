#!/usr/bin/pwsh
'Updating proxy...' | Out-Host

& (Join-Path '.' 'install.ps1')

'Proxy updated' | Out-Host
