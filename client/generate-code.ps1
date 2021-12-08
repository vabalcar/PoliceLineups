#!/usr/bin/pwsh
# supported versions of angular by swagger codegen: https://github.com/swagger-api/swagger-codegen-generators/blob/137b149e1e7078aeef23e8938a3caf1933f040ba/src/main/java/io/swagger/codegen/v3/generators/typescript/TypeScriptAngularClientCodegen.java#L206
& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'typescript-angular' -Destination (Join-Path 'src' 'app' 'api') -WhitelistFile 'apiGenerationWhitelist.json' -AdditionalConfiguration 'codegen-config.json'
