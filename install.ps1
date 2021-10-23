#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

[Executor]::ExecuteParallelly($Debug, @(
        @{Script = 'install.ps1'; WD = 'api' },
        @{Script = 'install.ps1'; WD = 'client' },
        @{Script = 'install.ps1'; WD = 'proxy' },
        @{Script = 'install.ps1'; WD = 'server' }
    ))
