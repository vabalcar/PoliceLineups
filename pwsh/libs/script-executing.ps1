using namespace System.Collections.Generic

class ScriptExecutionDescription {
    [string] $script
    [array] $argumentList = @()
    [string] $wd = '.'
    [string] $scriptFull
    [string] $outFile
    [string] $wrapper
    [bool] $isExternal = $false
}

class ScriptExecutor {
    [Queue[ScriptExecutionDescription]] $scriptExecutionDescriptions = [Queue[ScriptExecutionDescription]]::new()

    [void] Add([ScriptExecutionDescription] $scriptExecutionDescription) {

        $scriptExecutionDescription.outFile = (New-TemporaryFile).FullName
        $scriptExecutionDescription.scriptFull = Join-Path $scriptExecutionDescription.wd $scriptExecutionDescription.script

        $this.scriptExecutionDescriptions.Enqueue($scriptExecutionDescription)
    }

    [void] Execute() {
        throw [System.NotImplementedException]::new()
    }
}

class SequentialScriptExecutor : ScriptExecutor {

    [void] Execute() {

        $originalWD = Get-Location
        while ($this.scriptExecutionDescriptions.Count -gt 0) {
            $scriptExecutionDescription = $this.scriptExecutionDescriptions.Dequeue()
            Set-Location $scriptExecutionDescription.wd
            try {
                $argumentList = $scriptExecutionDescription.argumentList
                & (Join-Path '.' $scriptExecutionDescription.script) @argumentList
            } finally {
                Set-Location $originalWD
            }
        }
    }
}

class ParallelScriptExecutor : ScriptExecutor {

    [void] Execute() {

        while ($this.scriptExecutionDescriptions.Count -gt 0) {
            $scriptExecutionDescription = $this.scriptExecutionDescriptions.Dequeue()
            $script = $scriptExecutionDescription.script
            $argumentList = $scriptExecutionDescription.argumentList
            if ($scriptExecutionDescription.isExternal) {
                $wrapper = $scriptExecutionDescription.wrapper
                if (($null -ne $wrapper) -and ($wrapper.Length -gt 0)) {
                    Start-Process -WorkingDirectory $scriptExecutionDescription.wd -Path 'pwsh' -ArgumentList '-NoLogo', '-Command', "& $wrapper -Script $script -ArgumentList $argumentList"
                } else {
                    Start-Process -WorkingDirectory $scriptExecutionDescription.wd -Path 'pwsh' -ArgumentList '-NoLogo', '-File', $script @argumentList
                }
            } else {
                Start-Job -ArgumentList $scriptExecutionDescription -ScriptBlock {
                    $sd = $args[0]
                    Set-Location $sd.wd
                    $argumentList = $sd.argumentList
                    & pwsh -NoLogo -File $sd.script @argumentList *> $sd.outFile
                    return $sd
                }
            }
            "Running script $($scriptExecutionDescription.scriptFull)..." | Out-Host
        }

        $inProgress = (Get-Job | Measure-Object).Count
        while ($inProgress -gt 0) {
            $job = Get-Job | Wait-Job -Any
            $scriptExecutionDescription = Receive-Job -Job $job
            Remove-Job $job
            --$inProgress
            $scriptFull = $scriptExecutionDescription.scriptFull
            "Run of $scriptFull has completed, output follows:" | Out-Host
            "-----output of $scriptFull begin -----" | Out-Host
            Get-Content $scriptExecutionDescription.outFile | Out-Host
            "------output of $scriptFull end ------" | Out-Host
            Remove-Item -Force -Path $scriptExecutionDescription.outFile
        }
    }
}

class Executor {

    static [bool] IsParalellismAllowed() {
        $config = Get-Content -Path (Join-Path $PSScriptRoot '..' '..' 'config' 'build.json') | ConvertFrom-Json
        return $config.parallelismAllowed
    }

    static [void] Execute([ScriptExecutor] $executor, [ScriptExecutionDescription[]] $seds) {
        foreach($sed in $seds) {
            $executor.Add($sed)
        }
        $executor.Execute()
    }

    static [void] ExecuteParallelly([ScriptExecutionDescription[]] $seds) {
        [Executor]::Execute([Executor]::IsParalellismAllowed() ? [ParallelScriptExecutor]::new() : [SequentialScriptExecutor]::new(), $seds)
    }

    static [void] ExecuteSequentially([ScriptExecutionDescription[]] $seds) {
        [Executor]::Execute([SequentialScriptExecutor]::new(), $seds)
    }
}