#!/usr/bin/pwsh
'Updating client...' | Out-Host

& npm audit fix
& npm run-script update

'Client updated' | Out-Host
