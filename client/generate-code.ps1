#!/usr/bin/pwsh
Import-Module powershell-yaml

$apiDir = Join-Path '..' 'api'
& (Join-Path $apiDir 'generate-code.ps1') -Language 'typescript-angular' -Directory (Join-Path 'src' 'app' 'api') -AdditionalConfiguration 'codegen-config.json'
