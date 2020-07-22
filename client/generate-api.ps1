using namespace System.IO

Import-Module powershell-yaml

$origLocation = Get-Location
Set-Location (Join-Path '..' 'api')
& (Join-Path '.' 'generate-api.ps1') -lang 'typescript-angular' -dir (Join-Path '..' 'client' 'src' 'app' 'api')

[string] $yaml = [File]::ReadAllText((Join-Path (Get-Location) 'api.yaml'))
ConvertFrom-Yaml $yaml | ConvertTo-Yaml -JsonCompatible | ConvertFrom-Json | ConvertTo-Json | Out-File 'api.json'

Set-Location $origLocation
Get-ChildItem -Path (Join-Path 'src' 'app' 'api') -File | Where-Object -Property Name -NotIn (Get-Content 'api-generation-whitelist.json' | ConvertFrom-Json) | Remove-Item
