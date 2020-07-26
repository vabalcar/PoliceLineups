#!/usr/bin/pwsh
Param (
        [Parameter(Mandatory = $true)] [string] $Language,
        [Parameter(Mandatory = $true)] [string] $Directory,
        [string] $TmpDirectory = 'generated',
        [string] $APIGenerationWhitelist = 'apiGenerationWhitelist.json',
        [string] $API = 'api.yaml'
    )

function Invoke-SwaggerCodegen {
    Param (
        [Parameter(Mandatory = $true)] [string] $Language,
        [Parameter(Mandatory = $true)] [string] $Directory,
        [Parameter(Mandatory = $true)] [string] $API
    )

    "Generating $Language api in $Directory..." | Out-Host
    $curDir = $PSScriptRoot
    $swaggerCli = Join-Path $curDir 'swagger-codegen-cli.jar'
    $swaggerInput = Join-Path $curDir $API
    & java -jar $swaggerCli generate -i $swaggerInput -o $Directory -l $Language
    'done.' | Out-Host
}

Remove-Item -Recurse -Force -Path $TmpDirectory -ErrorAction Ignore
Invoke-SwaggerCodegen -Language $Language -Directory $TmpDirectory -API $API
Get-ChildItem -Force -Path $TmpDirectory
    | Where-Object -Property Name -NotIn (Get-Content $APIGenerationWhitelist | ConvertFrom-Json)
    | ForEach-Object {
        "Removing $_..." | Out-Host
        $_
    }
    | Remove-Item -Recurse -Force -ErrorAction Ignore

Get-ChildItem -Force -Path $Directory
    | Where-Object -Property Name -In (Get-Content $APIGenerationWhitelist | ConvertFrom-Json)
    | ForEach-Object {
        "Removing $_..." | Out-Host
        $_
    }
    | Remove-Item -Recurse -Force -ErrorAction Ignore
Move-Item -Force -Path (Join-Path $TmpDirectory '*') -Destination $Directory
Remove-Item -Recurse -Force -Path $TmpDirectory -ErrorAction Ignore