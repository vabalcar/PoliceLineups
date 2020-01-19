. (Join-Path '..' 'common' 'pwsh' 'script-executing')

[Executor]::ExecuteSequentially(@(
    @{Script = 'build.ps1'},
    @{Script = 'run.ps1'}
))