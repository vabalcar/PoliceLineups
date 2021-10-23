#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

$executor = $Debug ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'generate-code.ps1' },
        @{Script = 'install.ps1' }
    ))
