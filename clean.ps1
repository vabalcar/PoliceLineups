#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'clean.ps1'; WD = 'api' },
        @{Script = 'clean.ps1'; WD = 'client' },
        @{Script = 'clean.ps1'; WD = 'proxy' },
        @{Script = 'clean.ps1'; WD = 'server' }
    ))
