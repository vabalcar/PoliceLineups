#!/usr/bin/pwsh
. (Join-Path '.' 'common' 'pwsh' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'install.ps1'; WD = 'api'},
    @{Script = 'install.ps1'; WD = 'server'},
    @{Script = 'install.ps1'; WD = 'client'},
    @{Script = 'install.ps1'; WD = 'db'}
))