#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'uninstall.ps1'; WD = 'api' },
        @{Script = 'uninstall.ps1'; WD = 'client' },
        @{Script = 'uninstall.ps1'; WD = 'proxy' },
        @{Script = 'uninstall.ps1'; WD = 'server' }
    ))
