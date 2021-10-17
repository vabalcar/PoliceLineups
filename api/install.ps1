#!/usr/bin/pwsh
$swaggerCLIName = 'swagger-codegen-cli'
$outFile = "$swaggerCLIName.jar"

if (Test-Path -PathType Leaf $outFile) {
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
