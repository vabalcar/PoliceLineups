#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')

[Executor]::ExecuteSequentially(@(
        @{Script = 'build.ps1' },
        @{Script = 'run.ps1' }
    ))
