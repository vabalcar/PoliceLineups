$wd = Get-Location

Set-Location  (Join-Path .. api)
& (Join-Path . generate-api.ps1) -lang 'typescript-angular' -dir (Join-Path .. client src app api)

Set-Location $wd