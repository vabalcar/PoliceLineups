#!/usr/bin/pwsh
'Updating client...' | Out-Host

& npm audit fix
& ng update

'done.' | Out-Host
