#!/usr/bin/pwsh
param (
    [switch] $Force
)

$swaggerCLIName = 'swagger-codegen-cli'
$outFile = "$swaggerCLIName.jar"

if (!$Force -and (Test-Path -PathType Leaf $outFile)) {
    'Swagger codegen has been already installed' | Out-Host
    exit
}

$swaggerCLIInfo = Get-Content "$swaggerCLIName.json" | ConvertFrom-Json

$swaggerRepo = "$($swaggerCLIInfo.repoRoot)/$swaggerCLIName"
$swaggerVersion = $swaggerCLIInfo.version
$targetFile = "$swaggerCLIName-$swaggerVersion.jar"

"Downloading $swaggerCLIName $swaggerVersion..." | Out-Host
Invoke-WebRequest -URI "$swaggerRepo/$swaggerVersion/$targetFile" -OutFile $outFile
'done.' | Out-Host
