#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'script-executor.ps1')

$sequentialExecutor = [SequentialScriptExecutor]::new()
$executor = $Debug ? $sequentialExecutor : [ParallelScriptExecutor]::new()

$executor.Execute(@(
        @{Script = 'generate-code.ps1' },
        @{Script = 'install.ps1' }
    ))

if ($Debug) {
    exit
}

$sequentialExecutor.Execute(@(
        @{Script = 'compile.ps1' }
    ))
