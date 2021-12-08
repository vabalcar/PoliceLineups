#!/usr/bin/pwsh
'Updating Swagger codegen...' | Out-Host

& (Join-Path '.' 'install.ps1') -Force

'Swagger codegen updated' | Out-Host
