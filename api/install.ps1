#!/usr/bin/pwsh
$swaggerCLIName = 'swagger-codegen-cli'
$swaggerCLIInfo = Get-Content "$swaggerCLIName.json" | ConvertFrom-Json
$outFile = "$swaggerCLIName.jar"

if(!(Test-Path -PathType Leaf $outFile)) {
    $swaggerRepo = "$($swaggerCLIInfo.repoRoot)/$swaggerCLIName"
    $swaggerVersion = $swaggerCLIInfo.version
    $targetFile = "$swaggerCLIName-$swaggerVersion.jar"
    
    "Downloading Swagger $swaggerVersion..." | Out-Host
    Invoke-WebRequest -URI "$swaggerRepo/$swaggerVersion/$targetFile" -OutFile $outFile
    'done.' | Out-Host
} else {
    'Swagger already installed.' | Out-Host
}