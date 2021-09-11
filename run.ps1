#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')
$wrapper = (Join-Path '..' 'pwsh' 'libs' 'terminal-wrapper.ps1')

[Executor]::ExecuteParallelly(@(
        @{Script = 'run.ps1'; WD = 'db' },
        @{Script = 'run.ps1'; WD = 'server'; isExternal = $true; Wrapper = $wrapper },
        @{Script = 'run.ps1'; WD = 'client'; isExternal = $true; Wrapper = $wrapper }
    ))
