#!/usr/bin/pwsh
param (
    [Parameter(Mandatory)] [string] $Language,
    [Parameter(Mandatory)] [string] $Destination,
    [Parameter(Mandatory)] [string] $WhitelistFile,
    [string] $AdditionalConfiguration
)

function Invoke-SwaggerCodegen {
    param (
        [Parameter(Mandatory)] [string] $OutputDirectory
    )

    $swaggerCli = Join-Path $PSScriptRoot 'swagger-codegen-cli.jar'
    $inputFile = Join-Path $PSScriptRoot 'src' 'api.yaml'

    $swaggerCliArgs = 'generate', '-i', $inputFile, '-l', $Language, '-o', $OutputDirectory
    if ($AdditionalConfiguration) {
        $swaggerCliArgs += '-c', $AdditionalConfiguration
    }

    "Generating $Language api into $OutputDirectory..." | Out-Host

    <#
    Following line of code is a workaround described at https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-12F945EB-71D6-46AF-8C3D-D354FD0B1781
    to enable runnning swagger CLI on newer Java JREs than JRE 8 which seems to be oficially supported since swagger CLI is build using JDK 8 (see https://github.com/swagger-api/swagger-codegen/blob/master/run-in-docker.sh).
    #>
    $env:_JAVA_OPTIONS = "--add-opens=java.base/java.util=ALL-UNNAMED"
    & java -jar $swaggerCli @swaggerCliArgs

    "$Language api generated into $OutputDirectory" | Out-Host
}

$tmpDirectory = '.swagger-tmp'
Remove-Item -Recurse -Force -Path $tmpDirectory -ErrorAction Ignore -Verbose

Invoke-SwaggerCodegen -OutputDirectory $tmpDirectory

$whiteList = Get-Content $WhitelistFile | ConvertFrom-Json

Get-ChildItem -Force -Path $tmpDirectory
| Where-Object -Property Name -NotIn $whiteList
| Remove-Item -Recurse -Force -Verbose

New-Item -ItemType Directory -Path $Destination -ErrorAction Ignore -Verbose | Out-Null

Get-ChildItem -Force -Path $Destination
| Where-Object -Property Name -In $whiteList
| Remove-Item -Recurse -Force -Verbose

$tmpDirectoryContent = Join-Path $tmpDirectory '*'
Move-Item -Force -Path $tmpDirectoryContent -Destination $Destination -Verbose

Remove-Item -Recurse -Force -Path $tmpDirectory -ErrorAction Ignore -Verbose
