#!/usr/bin/pwsh
function ConvertTo-SwaggerRequirementsFileName { process { "swagger-$_" } }

$srcDir = 'src'

& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'python-flask' -Directory $srcDir

Copy-Item  -Recurse -Force -Path (Join-Path $srcDir 'swagger_server_override' '*') -Destination (Join-Path $srcDir 'swagger_server')

$whitelistedRequirementFiles = Get-Content 'apiGenerationWhitelist.json' | ConvertFrom-Json | Where-Object { $_ -Match '^.*requirements\.txt$' }
$whitelistedRequirementFiles | ConvertTo-SwaggerRequirementsFileName | Remove-Item -ErrorAction Ignore
$whitelistedRequirementFiles | ForEach-Object { Move-Item -Path (Join-Path $srcDir $_) -Destination ($_ | ConvertTo-SwaggerRequirementsFileName) }
