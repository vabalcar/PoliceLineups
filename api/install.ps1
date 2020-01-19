$package = Get-Content package-info.json | ConvertFrom-Json
$swaggerCLIName = 'swagger-codegen-cli'
$outFile = "$swaggerCLIName.jar"

while ($true) {
    try {
        $file = [System.IO.File]::Open($MyInvocation.MyCommand.Path, 'Open', 'Read', 'None')
        break
    }
    catch {
        [System.Threading.Thread]::Sleep(1000)
    }
}

if(!(Test-Path -PathType Leaf $outFile)) {
    $swaggerRepo = "http://central.maven.org/maven2/io/swagger/$swaggerCLIName"
    $swaggerVersion = $package.swaggerVersion
    $targetFile = "$swaggerCLIName-$swaggerVersion.jar"
    
    Write-Host "Downloading Swagger $swaggerVersion..."
    Invoke-WebRequest -OutFile $outFile "$swaggerRepo/$swaggerVersion/$targetFile"
    Write-Host "done."
} else {
    Write-Host "Swagger $swaggerVersion already installed."
}

$file.close()