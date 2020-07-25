#!/usr/bin/pwsh
. (Join-Path '..' 'common' 'pwsh' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'generate-api.ps1'},
    @{Script = 'install.ps1'}
))