. (Join-Path '.' 'common' 'pwsh' 'script-executing')
$cmdWrapper = (Join-Path '..' 'common' 'pwsh' 'cmd-wrapper.ps1')

[Executor]::ExecuteSequentially(@(
    @{Script = 'install.ps1'; WD = 'api'}
))
[Executor]::ExecuteParallelly(@(
    @{Script = 'build.ps1'; WD = 'server'},
    @{Script = 'build.ps1'; WD = 'client'},
    @{Script = 'install.ps1'; WD = 'db'}
))
[Executor]::ExecuteParallelly(@(
    @{Script = 'run.ps1'; WD = 'server'; isExternal = $true; Wrapper = $cmdWrapper},
    @{Script = 'run.ps1'; WD = 'client'; isExternal = $true; Wrapper = $cmdWrapper}
))