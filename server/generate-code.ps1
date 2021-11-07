#!/usr/bin/pwsh
function ConvertTo-SwaggerRequirementsFileName { process { "swagger-$_" } }

$srcDir = 'src'
$whitelistFile = 'apiGenerationWhitelist.json'

& (Join-Path '..' 'api' 'generate-code.ps1') -Language 'python-flask' -Destination $srcDir -WhitelistFile $whitelistFile

Copy-Item  -Recurse -Force -Path (Join-Path $srcDir 'swagger_server_override' '*') -Destination (Join-Path $srcDir 'swagger_server') -Verbose

$whitelistedRequirementFileNames = Get-Content $whitelistFile | ConvertFrom-Json | Where-Object { $_ -Match '^.*requirements\.txt$' }

$whitelistedRequirementFileNames
| ConvertTo-SwaggerRequirementsFileName
| Where-Object { Test-Path -PathType Leaf -Path $_ }
| Remove-Item -Verbose

$whitelistedRequirementFileNames
| ForEach-Object {
    $fileToMove = Join-Path $srcDir $_
    if (!(Test-Path -PathType Leaf -Path $fileToMove)) {
        return
    }

    Move-Item -Path $fileToMove -Destination ($_ | ConvertTo-SwaggerRequirementsFileName) -Verbose
}
