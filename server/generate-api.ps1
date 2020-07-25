#!/usr/bin/pwsh
& (Join-Path '..' 'api' 'generate-api.ps1') -Language 'python-flask' -Directory '.'
Copy-Item  -Recurse -Force -Path (Join-Path '.' 'swagger_server_override' '*') -Destination (Join-Path '.' 'swagger_server')
Get-Content '.\apiGenerationWhitelist.json' | ConvertFrom-Json | Where-Object { $_ -Match '^.*requirements\.txt$' } | ForEach-Object { Rename-Item -Path $_ -NewName "swagger-$_" }