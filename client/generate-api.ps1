using namespace System.IO

Import-Module powershell-yaml

Set-Location  (Join-Path '..' 'api')
& (Join-Path '.' 'generate-api.ps1') -lang 'typescript-angular' -dir (Join-Path '..' 'client' 'src' 'app' 'api')

[string] $yaml = [File]::ReadAllText((Join-Path (Get-Location) 'api.yaml'))
ConvertFrom-Yaml $yaml | ConvertTo-Yaml -JsonCompatible | ConvertFrom-Json | ConvertTo-Json | Out-File 'api.json'