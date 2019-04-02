$wd = Get-Location

Set-Location  (Join-Path .. api)
& (Join-Path . generate-api.ps1) -lang 'python-flask' -dir (Join-Path .. server api)

Set-Location $wd