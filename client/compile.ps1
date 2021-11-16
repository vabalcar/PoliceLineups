#!/usr/bin/pwsh
'Compiling client...' | Out-Host
& npm run build -- --configuration production
'Client compiled' | Out-Host
