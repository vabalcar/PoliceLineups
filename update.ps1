#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

[Executor]::ExecuteParallelly($Debug, @(
        @{Script = 'update.ps1'; WD = 'api' },
        @{Script = 'update.ps1'; WD = 'server' },
        @{Script = 'update.ps1'; WD = 'client' }
    ))
