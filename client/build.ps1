. (Join-Path '..' 'common' 'pwsh' 'script-executing')

[Executor]::ExecuteParallelly(@(
    @{Script = 'install.ps1'}, 
    @{Script = 'generate-api.ps1'}
))