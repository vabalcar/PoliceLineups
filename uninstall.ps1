#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

[Executor]::ExecuteParallelly($Debug, @(
        @{Script = 'uninstall.ps1'; WD = 'api' },
        @{Script = 'uninstall.ps1'; WD = 'client' },
        @{Script = 'uninstall.ps1'; WD = 'proxy' },
        @{Script = 'uninstall.ps1'; WD = 'server' }
    ))
