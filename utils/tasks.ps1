. (Join-Path $PSScriptRoot 'script-executor.ps1')

function Invoke-Rebuild {
    param (
        [switch] $Debug
    )

    $executor = [SequentialScriptExecutor]::new()

    $commonArgs = $Debug ? @('-Debug') : @()

    $executor.Execute(@(
            @{Script = 'clean.ps1' },
            @{Script = 'build.ps1'; ArgumentList = $commonArgs }
        ))
}

function Invoke-BuildAndRun {
    param (
        [switch] $Debug
    )

    $executor = [SequentialScriptExecutor]::new()

    $commonArgs = $Debug ? @('-Debug') : @()

    $executor.Execute(@(
            @{Script = 'build.ps1'; ArgumentList = $commonArgs },
            @{Script = 'run.ps1'; ArgumentList = $commonArgs }
        ))
}
