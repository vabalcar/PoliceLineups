$wd = Get-Location

Set-Location api
& (Join-Path . install.ps1)
Set-Location $wd

Set-Location client
& (Join-Path . install.ps1)
Set-Location $wd