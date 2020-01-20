$config = Get-Content (Join-Path '..' 'config' 'client.json') | ConvertFrom-Json
Write-Host 'Running client...'
& (Join-Path '..' 'common' 'pwsh' 'ctrlc-wrapper.ps1') -Proc (Start-Process -NoNewWindow -PassThru -FilePath 'pwsh' -Args '-Command', "& {ng serve --open --host $($config.host) --port $($config.port)}")
Write-Host 'stopped.'