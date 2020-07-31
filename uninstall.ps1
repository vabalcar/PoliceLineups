#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'uninstall.ps1'; WD = 'api'},
    @{Script = 'uninstall.ps1'; WD = 'db'},
    @{Script = 'uninstall.ps1'; WD = 'server'},
    @{Script = 'uninstall.ps1'; WD = 'client'}
))