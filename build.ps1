. (Join-Path '.' 'common' 'pwsh' 'script-executing')

[Executor]::ExecuteSequentially(@(
    @{Script = 'check-environment.ps1'},
    @{Script = 'install.ps1'; WD = 'api'}
))
[Executor]::ExecuteParallelly(@(
    @{Script = 'install.ps1'; WD = 'server'},
    @{Script = 'generate-api.ps1'; WD = 'server'},
    @{Script = 'install.ps1'; WD = 'client'},
    @{Script = 'generate-api.ps1'; WD = 'client'},
    @{Script = 'install.ps1'; WD = 'db'}
))