. (Join-Path '.' 'script-executing.ps1')

$res = Measure-Command {
    [Executor]::ExecuteParallelly(@(
        @{Script = 'consumer-test.ps1'},
        @{Script = 'producer-test.ps1'}
    ))
}

$secs = $res.TotalSeconds
Write-Host "Duration: ${secs}s"