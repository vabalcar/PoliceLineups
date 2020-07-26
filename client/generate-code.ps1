#!/usr/bin/pwsh
Import-Module powershell-yaml

$apiDir = Join-Path '..' 'api'
& (Join-Path $apiDir 'generate-code.ps1') -Language 'typescript-angular' -Directory (Join-Path 'src' 'app' 'api')

Get-Content -Raw -Path (Join-Path $apiDir 'api.yaml')
# Convert from yaml to ugly but complete json
| ConvertFrom-Yaml | ConvertTo-Yaml -JsonCompatible
# Convert ugly json to nice json using following line converts hashtables in original yaml to strings containing serialized hashtables, which is probably wrong conversion
#| ConvertFrom-Json | ConvertTo-Json
| Out-File (Join-Path $apiDir 'api.json')