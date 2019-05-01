using namespace System.Collections.Generic

class ScriptExecutionDescription {
    [string] $script
    [string] $wd
    [string] $outFile
    [string] $wrapper
    [bool] $isExternal
}

class ScriptExecutor {
    hidden [int] $id = -1
    [Queue[ScriptExecutionDescription]] $scriptExecutionDescriptions = [Queue[ScriptExecutionDescription]]::new()

    [void] Add([ScriptExecutionDescription] $scriptExecutionDescription) {
        [int] $curId = ++$this.id
        $script = $scriptExecutionDescription.script
        [string] $scriptExecutionDescription.outFile = "$script.$curId.out"

        if (($scriptExecutionDescription.wd -eq $null) -or ($scriptExecutionDescription.wd.Length -eq 0)) {
            $scriptExecutionDescription.wd = '.'
        }

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
            & (Join-Path '.' $scriptExecutionDescription.script)
            Set-Location $originalWD
        }
    }
}

class ParallelScriptExecutor : ScriptExecutor {
    
    [void] Execute() {      
        
        while ($this.scriptExecutionDescriptions.Count -gt 0) {
            $scriptExecutionDescription = $this.scriptExecutionDescriptions.Dequeue()
            $script = $scriptExecutionDescription.script
            if ($scriptExecutionDescription.isExternal) {
                $wrapper = $scriptExecutionDescription.wrapper
                if (($wrapper -ne $null) -and ($wrapper.Length -gt 0)) {
                    Start-Process -PassThru -WorkingDirectory $scriptExecutionDescription.wd -Path 'pwsh' -Args '-NoLogo', '-Command', "& $wrapper -Script $script"
                } else {
                    Start-Process -PassThru -WorkingDirectory $scriptExecutionDescription.wd -Path 'pwsh' -Args '-NoLogo', '-File', $script
                }
            } else {
                Start-Job -ArgumentList (Get-Location), $scriptExecutionDescription -ScriptBlock {
                    $wd = $args[0]
                    $sd = $args[1]
                    
                    if ([System.IO.Path]::IsPathRooted($sd.wd)) {
                        Set-Location $sd.wd
                    } else {
                        Set-Location (Join-Path $wd $sd.wd)
                    }
                    & (Join-Path '.' $sd.script) *> (Join-Path $wd $sd.outFile)
                    return $sd
                }
            }
            Write-Host "Running script $script..."
        }

        $inProgress = (Get-Job | Measure-Object).Count
        while ($inProgress -gt 0) {
            $job = Get-Job | Wait-Job -Any
            $scriptExecutionDescription = Receive-Job -Job $job
            Remove-Job $job
            --$inProgress
            $script = $scriptExecutionDescription.script
            Write-Host "Run of $script has completed, output follows:"
            Write-Host "----- $script's output begin -----"
            Get-Content (Join-Path '.' $scriptExecutionDescription.outFile) | Out-Host
            Write-Host "------ $script's output end ------"
            Remove-Item -Force -Path $scriptExecutionDescription.outFile
        }
    }
}

class Executor {
    
    static [void] Execute([ScriptExecutor] $executor, [ScriptExecutionDescription[]] $seds) {
        foreach($sed in $seds) {
            $executor.Add($sed)
        }
        $executor.Execute()
    }

    static [void] ExecuteParallelly([ScriptExecutionDescription[]] $seds) {
        [Executor]::Execute([ParallelScriptExecutor]::new(), $seds)
    }

    static [void] ExecuteSequentially([ScriptExecutionDescription[]] $seds) {
        [Executor]::Execute([SequentialScriptExecutor]::new(), $seds)
    }
}