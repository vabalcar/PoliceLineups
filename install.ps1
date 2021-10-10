#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
        @{Script = 'install.ps1'; WD = 'api' },
        @{Script = 'install.ps1'; WD = 'server' },
        @{Script = 'install.ps1'; WD = 'client' }
    ))
