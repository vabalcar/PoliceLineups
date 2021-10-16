#!/usr/bin/pwsh
& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'typescript-angular' -Directory (Join-Path 'src' 'app' 'api') -AdditionalConfiguration 'codegen-config.json'
