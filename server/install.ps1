#!/usr/bin/pwsh
$packageInfo = Get-Content package-info.json | ConvertFrom-Json

& (Join-Path '.' 'activate.ps1')

'Installing dependencies...' | Out-Host
$deps = $packageInfo.dependencies
foreach ($dep in $deps) {
    & pip install $dep
}
'done.' | Out-Host

& deactivate