Write-Host 'Running server...'
$packageInfo = Get-Content (Join-Path '.' 'package-info.json') | ConvertFrom-Json
$config = Get-Content (Join-Path '..' 'config' 'server.json') | ConvertFrom-Json
$venvName = $packageInfo.venvName

if ($IsWindows) {
    & (Join-Path "$venvName" 'Scripts' 'activate.ps1')
} else {
    & 'source' (Join-Path "$venvName" 'bin' 'activate')
}

$env:FLASK_RUN_HOST = $config.host
$env:FLASK_RUN_PORT = $config.port
& (Join-Path '..' 'common' 'pwsh' 'ctrlc-wrapper.ps1') -Proc (Start-Process -nnw -PassThru -Path 'python' -Args 'app.py')

& deactivate
Write-Host 'stopped.'