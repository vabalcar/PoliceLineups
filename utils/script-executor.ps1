using namespace System.Collections.Generic
using namespace System.Diagnostics

class ScriptExecution {
    [string] $Script
    [string] $WD = '.'
    [array] $ArgumentList = @()
}

class ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        throw [System.NotImplementedException]::new()
    }
}

class SequentialScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        $processInProgress = $null

        try {
            $scriptExcutions
            | ForEach-Object {
                Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) sequentially"

                $processInProgress = Start-Process -PassThru -NoNewWindow -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-File', "$($_.Script) $($_.ArgumentList)"
                $processInProgress | Wait-Process
            }
        }
        finally {
            if ($null -ne $processInProgress) {
                # Wait after pressing ctrl+c
                $processInProgress | Wait-Process
            }
        }
    }
}

class ParallelScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        [List[Process]] $backgroundProcesses = [List[Process]]::new()

        try {
            $scriptExcutions
            | ForEach-Object {
                Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) parallelly"

                $backgroundProcess = Start-Process -PassThru -NoNewWindow -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-NonInteractive', '-File', "$($_.Script) $($_.ArgumentList)"
                $backgroundProcesses.Add($backgroundProcess)
                return $backgroundProcess
            }
            | Wait-Process
        }
        finally {
            # Wait after pressing ctrl+c
            $backgroundProcesses | Wait-Process
        }
    }
}

class ExternalScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {
        $scriptExcutions
        | ForEach-Object {
            Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) externally"

            Start-Process -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-NoExit', '-File', "$($_.Script) $($_.ArgumentList)"
        }
    }
}
