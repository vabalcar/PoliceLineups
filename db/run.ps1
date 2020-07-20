Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-File', (Join-Path '.' 'run-mysql.ps1')
"DB is $((Get-Service 'Mysql80').Status.ToString().ToLower())" | Out-Host