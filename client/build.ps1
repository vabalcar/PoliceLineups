#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

[Executor]::ExecuteParallelly($Debug, @(
        @{Script = 'generate-code.ps1' },
        @{Script = 'install.ps1' }
    ))
