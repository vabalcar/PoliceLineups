#!/usr/bin/pwsh
using namespace System.IO

param (
    [Parameter(Mandatory)] [string] $ConfigurationFile,
    [switch] $PassThru
)

$configurationFileName = Split-Path -Leaf $ConfigurationFile
$configurationSchemaFileName = "$([Path]::GetFileNameWithoutExtension($configurationFileName)).schema.json"
$configurationSchemaFile = Join-Path $PSScriptRoot 'schemata' $configurationSchemaFileName

$testResult = Get-Content -Raw $ConfigurationFile
| Test-Json -SchemaFile $configurationSchemaFile -ErrorAction SilentlyContinue -ErrorVariable 'validationErrors'

if ($validationErrors) {
    $configurationFileFullPath = $ConfigurationFile | Resolve-Path
    $validationErrorsOutput = $validationErrors | Join-String -Separator "`n"
    Write-Host "Errors found in configuration file $configurationFileFullPath`:`n$validationErrorsOutput" -ForegroundColor Red
}

if ($PassThru) {
    return $testResult
}
