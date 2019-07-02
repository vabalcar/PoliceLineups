. (Join-Path '.' 'common' 'pwsh' 'script-executing')

[Executor]::ExecuteSequentially(@(
    @{Script = 'check-environment.ps1'}
))

[Executor]::ExecuteParallelly(@(
    @{Script = 'install.ps1'; WD = 'api'}, 
    @{Script = 'install.ps1'; WD = 'server'},
    @{Script = 'install.ps1'; WD = 'client'},
    @{Script = 'install.ps1'; WD = 'db'}
))