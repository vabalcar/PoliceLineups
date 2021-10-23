#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$commonArgs = $Debug ? @('-Debug') : @()

[Executor]::ExecuteSequentially(@(
        @{Script = 'install.ps1'; WD = 'api' },
        @{Script = 'generate-code.ps1'; ArgumentList = $commonArgs }
    ))

[Executor]::ExecuteParallelly($Debug, @(
        @{Script = 'install.ps1'; WD = 'client' },
        @{Script = 'build.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'install.ps1'; WD = 'server' }
    ))
