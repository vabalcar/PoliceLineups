#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteParallelly(@(
        @{Script = 'generate-code.ps1'; WD = 'server' },
        @{Script = 'generate-code.ps1'; WD = 'client' }
    ))
