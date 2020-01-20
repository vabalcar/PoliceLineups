. (Join-Path '.' 'common' 'pwsh' 'script-executing')
$cmdWrapper = (Join-Path '..' 'common' 'pwsh' 'cmd-wrapper.ps1')

[Executor]::ExecuteParallelly(@(
    @{Script = 'run.ps1'; WD = 'db'; isExternal = $true; Wrapper = $cmdWrapper},
    @{Script = 'run.ps1'; WD = 'server'; isExternal = $true; Wrapper = $cmdWrapper},
    @{Script = 'run.ps1'; WD = 'client'; isExternal = $true; Wrapper = $cmdWrapper}
))