#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'update.ps1'; WD = 'api' },
        @{Script = 'update.ps1'; WD = 'server' },
        @{Script = 'update.ps1'; WD = 'client' }
    ))
