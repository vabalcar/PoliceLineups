#!/usr/bin/pwsh
& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'typescript-angular' -Destination (Join-Path 'src' 'app' 'api') -WhitelistFile 'apiGenerationWhitelist.json' -AdditionalConfiguration 'codegen-config.json'
