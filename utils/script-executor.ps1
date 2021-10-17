using namespace System.Collections.Generic

class ScriptExecutionInput {
    [string] $Script
    [array] $ArgumentList = @()
    [string] $WD = '.'
}

class ScriptExecution : ScriptExecutionInput {
    [string] $ScriptFullPath
    [string] $OutFile
}

class ScriptExecutor {
    [Queue[ScriptExecution]] $ses = [Queue[ScriptExecution]]::new()

    [void] Add([ScriptExecution] $se) {
        $se.OutFile = (New-TemporaryFile).FullName
        $se.ScriptFullPath = Join-Path $se.WD $se.Script

        $this.ses.Enqueue($se)
    }

    [void] InitializeScriptExecution([ScriptExecution] $se) {
        "Running script $($se.ScriptFullPath)" | Out-Host
    }

    [void] InitializeScriptExecutionOutput([ScriptExecution] $se) {
        "----- output of $($se.ScriptFullPath) begin -----" | Out-Host
    }

    [void] FinalizeScriptExecutionOutput([ScriptExecution] $se) {
        "------ output of $($se.ScriptFullPath) end ------" | Out-Host
    }

    [void] Execute() {
        throw [System.NotImplementedException]::new()
    }
}

class SequentialScriptExecutor : ScriptExecutor {
    [void] Execute() {
        while ($this.ses.Count -gt 0) {
            $se = $this.ses.Dequeue()
            $this.InitializeScriptExecution($se)
            $this.InitializeScriptExecutionOutput($se)
            Start-Process -Wait -NoNewWindow -WorkingDirectory $se.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-File', "$($se.Script) $($se.ArgumentList)"
            $this.FinalizeScriptExecutionOutput($se)
        }
    }
}

class ParallelScriptExecutor : ScriptExecutor {
    [void] Execute() {
        while ($this.ses.Count -gt 0) {
            $se = $this.ses.Dequeue()
            $this.InitializeScriptExecution($se)
            Start-Job -ArgumentList $se -ScriptBlock {
                $se = $args[0]
                Set-Location $se.WD
                & (Join-Path '.' $se.Script) @($se.ArgumentList) *> $se.OutFile
                return $se
            }
        }

        $inProgress = (Get-Job | Measure-Object).Count
        while ($inProgress -gt 0) {
            $job = Get-Job | Wait-Job -Any
            $se = Receive-Job -Job $job
            Remove-Job $job
            --$inProgress
            "Run of $($se.ScriptFullPath) has completed, output follows:" | Out-Host
            $this.InitializeScriptExecutionOutput($se)
            Get-Content $se.OutFile | Out-Host
            $this.FinalizeScriptExecutionOutput($se)
            Remove-Item -Force -Path $se.OutFile
        }
    }
}

class ExternalScriptExecutor : ScriptExecutor {
    [void] Execute() {
        while ($this.ses.Count -gt 0) {
            $se = $this.ses.Dequeue()
            $this.InitializeScriptExecution($se)
            Start-Process -WorkingDirectory $se.WD -Path 'pwsh' -ArgumentList '-NoLogo', '-NoExit', '-File', "$($se.Script) $($se.ArgumentList)"
        }
    }
}

class Executor {
    static [void] ExecuteSequentially([ScriptExecutionInput[]] $excutionInputs) {
        [Executor]::execute([SequentialScriptExecutor]::new(), $excutionInputs)
    }

    static [void] ExecuteParallelly([bool] $isDebugMode, [ScriptExecutionInput[]] $excutionInputs) {
        [Executor]::execute([Executor]::isParalellismAllowed($isDebugMode) ? [ParallelScriptExecutor]::new() : [SequentialScriptExecutor]::new(), $excutionInputs)
    }

    static [void] ExecuteExternally([ScriptExecutionInput[]] $excutionInputs) {
        [Executor]::execute([ExternalScriptExecutor]::new(), $excutionInputs)
    }

    hidden static [bool] isParalellismAllowed([bool] $isDebugMode) {
        $environment = $isDebugMode ? 'debug' : 'production'
        $config = Get-Content -Path (Join-Path $PSScriptRoot '..' 'config' $environment 'build.json') | ConvertFrom-Json
        return $config.parallelismAllowed
    }

    hidden static [void] execute([ScriptExecutor] $executor, [ScriptExecutionInput[]] $excutionInputs) {
        foreach ($executionInput in $excutionInputs) {
            $executor.Add(@{ Script = $executionInput.Script; WD = $executionInput.WD; ArgumentList = $executionInput.ArgumentList })
        }
        $executor.Execute()
    }
}