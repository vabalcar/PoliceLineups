#!/usr/bin/pwsh
Param (
    [Parameter(Mandatory = $true)] [string] $dir,
    [Parameter(Mandatory = $true)] [string] $lang,
    [string] $api = 'api.yaml'
)

Write-Host "Generating $lang api in $dir..."
$curDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$swaggerCli = Join-Path "$curDir" 'swagger-codegen-cli.jar'
$swaggerInput = Join-Path "$curDir" 'api.yaml'
& 'java' '-jar' $swaggerCli 'generate' '-i' $swaggerInput '-o' $dir '-l' $lang
Write-Host 'done.'