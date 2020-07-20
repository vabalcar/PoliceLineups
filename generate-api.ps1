. (Join-Path '.' 'common' 'pwsh' 'script-executing')

[Executor]::ExecuteParallelly(@(
    @{Script = 'generate-api.ps1'; WD = 'server'},
    @{Script = 'generate-api.ps1'; WD = 'client'}
))