class ScriptExecution {
    [string] $WD = '.'
    [string] $Script
    [array] $ArgumentList = @()
}

class ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        throw [System.NotImplementedException]::new()
    }
}

class SequentialScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        $scriptExcutions
        | ForEach-Object {
            Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) sequentially"

            Start-Process -Wait -NoNewWindow -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-File', "$($_.Script) $($_.ArgumentList)"
        }
    }
}

class ParallelScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        $scriptExcutions
        | ForEach-Object {
            Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) parallelly"

            Start-Process -PassThru -NoNewWindow -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-File', "$($_.Script) $($_.ArgumentList)"
        }
        | Wait-Process
    }
}

class ExternalScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        $scriptExcutions
        | ForEach-Object {
            Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) externally"

            Start-Process -PassThru -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-NoExit', '-File', "$($_.Script) $($_.ArgumentList)"
        }
        | Wait-Process
    }
}
