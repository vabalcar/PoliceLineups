using namespace System.Collections.Generic
using namespace System.Diagnostics
using namespace System.IO

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

class ServiceScriptExecutor : ScriptExecutor {
    [void] Execute([ScriptExecution[]] $scriptExcutions) {

        $pidDirectory = $this.GetOrCreateVarDirectory('pid')
        $logDirectory = $this.GetOrCreateVarDirectory('log')

        $scriptExcutions
        | ForEach-Object {
            $scriptWithoutExtension = [Path]::GetFileNameWithoutExtension(($_.Script))

            $processPidDirectory = $this.GetOrCreateDirectory((Join-Path $pidDirectory $_.WD))
            $pidFile = Join-Path $processPidDirectory "$scriptWithoutExtension.pid"

            if (Test-Path -PathType Leaf -Path $pidFile) {
                "$(Join-Path $_.WD $_.Script) is already running" | Out-Host
                return
            }

            $processLogDirectory = $this.GetOrCreateDirectory((Join-Path $logDirectory $_.WD))
            $logFile = Join-Path $processLogDirectory "$scriptWithoutExtension.log"

            $windowStyle = $IsWindows ? @('-WindowStyle', 'Hidden') : @()
            $serviceProcess = Start-Process -PassThru @windowStyle -WorkingDirectory $_.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-Command', "& pwsh -File $($_.Script) $($_.ArgumentList) *> $logFile"
            $serviceProcess.Id | Out-File -FilePath $pidFile

            Write-Host -ForegroundColor DarkCyan "Running script $(Join-Path $_.WD $_.Script) as a service"
        }
    }

    [void] PrintExecutionStatus() {
        $runningScripts = 0

        Get-ChildItem -Recurse -Name -Path $this.GetOrCreateVarDirectory('pid') -Include '*.pid'
        | ForEach-Object {
            ++$runningScripts
            "$($this.GetScript($_)) is running" | Out-Host
        }

        if ($runningScripts -eq 0) {
            'Nothing is running' | Out-Host
        }
    }

    [void] TerminateAllExecutions() {
        $pidDirectory = $this.GetOrCreateVarDirectory('pid')
        $terminatedScripts = 0

        Get-ChildItem -Recurse -Name -Path $pidDirectory -Include '*.pid'
        | ForEach-Object {
            $targetPidFile = Join-Path $pidDirectory $_
            $targetPid = Get-Content $targetPidFile
            if ($IsWindows) {
                & taskkill /f /t /pid $targetPid | Out-Host
            }
            else {
                Write-Host -NoNewline 'Stopping processes with following PIDs: '
                & rkill $targetPid | Out-Host
            }
            Remove-Item -Path $targetPidFile
            ++$terminatedScripts
            "$($this.GetScript($_)) has been stopped" | Out-Host
        }

        if ($terminatedScripts -eq 0) {
            'Nothing to stop' | Out-Host
        }
    }

    hidden [string] GetOrCreateVarDirectory([string] $name) {
        return $this.GetOrCreateDirectory((Join-Path $PSScriptRoot '..' '.var' $name))
    }

    hidden [string] GetOrCreateDirectory([string] $path) {
        New-Item -ItemType Directory -Path $path -ErrorAction Ignore
        return $path
    }

    hidden [string] GetScript([string] $pidFilePath) {
        $parentDirectory = Split-Path -Parent $pidFilePath
        $scriptName = "$([Path]::GetFileNameWithoutExtension($_)).ps1"
        return Join-Path $parentDirectory $scriptName
    }
}
