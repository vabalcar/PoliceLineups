Write-Output 'Installing angular...'
Start-Process -nnw -Wait -Path 'npm' -Args 'install'
Write-Output 'done.'