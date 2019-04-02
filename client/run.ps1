Write-Output 'Running angular...'
& (Join-Path .. common pwsh ctrlc-wrapper.ps1) -Proc (Start-Process -nnw -PassThru -Path 'ng' -Args 'serve', '--open')
Write-Output 'stopped.'