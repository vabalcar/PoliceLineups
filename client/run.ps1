$config = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json
Write-Host 'Running client...'
& (Join-Path '..' 'common' 'pwsh' 'ctrlc-wrapper.ps1') -Proc (Start-Process -nnw -PassThru -Path 'ng' -Args 'serve', '--open', '--host', $config.host, '--port', $config.port)
Write-Host 'stopped.'