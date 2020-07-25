#!/usr/bin/pwsh
. (Join-Path '.' 'pwsh' 'libs' 'script-executing.ps1')
$cmdWrapper = (Join-Path '..' 'pwsh' 'libs' 'cmd-wrapper.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'run.ps1'; WD = 'db'; isExternal = $true; Wrapper = $cmdWrapper},
    @{Script = 'run.ps1'; WD = 'server'; isExternal = $true; Wrapper = $cmdWrapper},
    @{Script = 'run.ps1'; WD = 'client'; isExternal = $true; Wrapper = $cmdWrapper}
))