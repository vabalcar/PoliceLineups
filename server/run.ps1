$venvName = 'server-env'

Write-Output 'Running server...'
if ($IsWindows) {
    & (Join-Path $venvName Scripts activate.ps1)
} else {
    Start-Process -nnw -Wait -Path 'source' -Args (Join-Path $venvName bin activate)
}
$env:FLASK_APP = 'app.py'

& (Join-Path .. common pwsh ctrlc-wrapper.ps1) -Proc (Start-Process -nnw -PassThru -Path 'flask' -Args 'run')

& deactivate
Write-Output 'stopped'