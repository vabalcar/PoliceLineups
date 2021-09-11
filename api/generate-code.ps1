#!/usr/bin/pwsh
param (
    [Parameter(Mandatory = $true)] [string] $Language,
    [Parameter(Mandatory = $true)] [string] $Directory,
    [string] $TmpDirectory = 'generated',
    [string] $APIGenerationWhitelist = 'apiGenerationWhitelist.json',
    [string] $API = 'api.yaml',
    [string] $AdditionalConfiguration
)

function Invoke-SwaggerCodegen {
    param (
        [Parameter(Mandatory = $true)] [string] $Language,
        [Parameter(Mandatory = $true)] [string] $Directory,
        [Parameter(Mandatory = $true)] [string] $API
    )

    "Generating $Language api in $Directory" | Out-Host
    $curDir = $PSScriptRoot
    $swaggerCli = Join-Path $curDir 'swagger-codegen-cli.jar'
    $swaggerInput = Join-Path $curDir $API

    $swaggerCliArgs = 'generate', '-i', $swaggerInput, '-o', $Directory, '-l', $Language
    if ($AdditionalConfiguration) {
        $swaggerCliArgs += '-c', $AdditionalConfiguration
    }

    <#
    Following line of code is a workaround described at https://docs.oracle.com/javase/9/migrate/toc.htm#JSMIG-GUID-12F945EB-71D6-46AF-8C3D-D354FD0B1781
    to enable runnning swagger CLI on newer Java JREs than JRE 8 which seems to be oficially supported since swagger CLI is build using JDK 8 (see https://github.com/swagger-api/swagger-codegen/blob/master/run-in-docker.sh).
    #>
    $env:_JAVA_OPTIONS = "--add-opens=java.base/java.util=ALL-UNNAMED"

    & java -jar $swaggerCli @swaggerCliArgs

    'done.' | Out-Host
}

Remove-Item -Recurse -Force -Path $TmpDirectory -ErrorAction Ignore
Invoke-SwaggerCodegen -Language $Language -Directory $TmpDirectory -API $API
Get-ChildItem -Force -Path $TmpDirectory
| Where-Object -Property Name -NotIn (Get-Content $APIGenerationWhitelist | ConvertFrom-Json)
| ForEach-Object {
    "Removing $_" | Out-Host
    $_
}
| Remove-Item -Recurse -Force -ErrorAction Ignore

if (!(Test-Path -PathType Container -Path $Directory)) {
    New-Item -ItemType Directory -Path $Directory | Out-Null
    "Created directory $Directory" | Out-Host
}

Get-ChildItem -Force -Path $Directory
| Where-Object -Property Name -In (Get-Content $APIGenerationWhitelist | ConvertFrom-Json)
| ForEach-Object {
    "Removing $_" | Out-Host
    $_
}
| Remove-Item -Recurse -Force -ErrorAction Ignore

$tmpDirectoryContent = Join-Path $TmpDirectory '*'
"Moving $tmpDirectoryContent into $Directory" | Out-Host
Move-Item -Force -Path $tmpDirectoryContent -Destination $Directory

"Removing $TmpDirectory" | Out-Host
Remove-Item -Recurse -Force -Path $TmpDirectory -ErrorAction Ignore
