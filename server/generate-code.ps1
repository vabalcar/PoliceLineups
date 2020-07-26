#!/usr/bin/pwsh
function Get-ReqRenamePattern { process { "swagger-$_" } }

$srcDir = 'src'

& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'python-flask' -Directory $srcDir

Copy-Item  -Recurse -Force -Path (Join-Path $srcDir 'swagger_server_override' '*') -Destination (Join-Path $srcDir 'swagger_server')

$whitelistedRequirements = Get-Content 'apiGenerationWhitelist.json' | ConvertFrom-Json | Where-Object { $_ -Match '^.*requirements\.txt$' }
$whitelistedRequirements | Get-ReqRenamePattern | Remove-Item -ErrorAction Ignore
$whitelistedRequirements | ForEach-Object { Move-Item -Path (Join-Path $srcDir $_) -Destination ($_ | Get-ReqRenamePattern) }