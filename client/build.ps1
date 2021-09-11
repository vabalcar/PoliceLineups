#!/usr/bin/pwsh
. (Join-Path '..' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'generate-code.ps1'},
    @{Script = 'install.ps1'}
))
