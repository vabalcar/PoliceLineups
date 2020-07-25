#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'generate-api.ps1'; WD = 'server'},
    @{Script = 'generate-api.ps1'; WD = 'client'}
))