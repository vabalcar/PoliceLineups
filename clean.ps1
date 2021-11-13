#!/usr/bin/pwsh
param (
    [switch] $Debug,
    [switch] $WhatIf,
    [switch] $Confirm
)

. (Join-Path '.' 'utils' 'script-executor.ps1')

$executor = $Debug -or $Confirm ? [SequentialScriptExecutor]::new() : [ParallelScriptExecutor]::new()

$commonArgs = $WhatIf ? @('-WhatIf')
: $Confirm ? @('-Confirm')
: @()

$executor.Execute(@(
        @{Script = 'clean.ps1'; WD = 'api'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'client'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'proxy'; ArgumentList = $commonArgs },
        @{Script = 'clean.ps1'; WD = 'server'; ArgumentList = $commonArgs }
    ))
