$package = Get-Content package-info.json | ConvertFrom-Json
$swaggerCLIName = 'swagger-codegen-cli'
$outFile = "$swaggerCLIName.jar"

if((!(Test-Path -PathType Leaf $outFile)) -or ((Read-Host "Swagger already installed. Reinstall? [y/n]").ToLower() -eq 'y')) {
    
    $swaggerRepo = "http://central.maven.org/maven2/io/swagger/$swaggerCLIName"
    $swaggerVersion = $package.swaggerVersion
    $targetFile = "$swaggerCLIName-$swaggerVersion.jar"
    
    Write-Output "Downloading Swagger $swaggerVersion..."
    Invoke-WebRequest -OutFile $outFile "$swaggerRepo/$swaggerVersion/$targetFile"
    Write-Output "done."
}