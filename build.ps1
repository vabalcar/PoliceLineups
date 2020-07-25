#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteSequentially(@(
    @{Script = 'install.ps1'; WD = 'api'},
    @{Script = 'generate-api.ps1'},
    @{Script = 'install.ps1'}
))