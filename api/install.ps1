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

'Installing Swagger codegen...' | Out-Host

$swaggerCLIInfo = Get-Content "$swaggerCLIName.jsonc" | ConvertFrom-Json

$swaggerRepo = "$($swaggerCLIInfo.repoRoot)/$swaggerCLIName"
$swaggerVersion = $swaggerCLIInfo.version
$targetFile = "$swaggerCLIName-$swaggerVersion.jar"

"Downloading $swaggerCLIName $swaggerVersion..." | Out-Host

$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -URI "$swaggerRepo/$swaggerVersion/$targetFile" -OutFile $outFile
$ProgressPreference = 'Continue'

'Swagger codegen installed' | Out-Host
