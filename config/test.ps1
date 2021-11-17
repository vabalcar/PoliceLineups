#!/usr/bin/pwsh
using namespace System.IO

param (
    [Parameter(Mandatory)] [string] $ConfigurationFile,
    [switch] $PassThru
)

if (!(Test-Path -PathType Leaf -Path $ConfigurationFile)) {
    $configurationFileFullPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($ConfigurationFile)
    Write-Host -ForegroundColor Red "Missing configuration file $configurationFileFullPath"
    if ($PassThru) {
        return $false
    }
    exit
}

$configurationFileName = Split-Path -Leaf $ConfigurationFile
$configurationSchemaFileName = "$([Path]::GetFileNameWithoutExtension($configurationFileName)).schema.json"
$configurationSchemaFile = Join-Path $PSScriptRoot 'schemata' $configurationSchemaFileName

$testResult = Get-Content -Raw $ConfigurationFile
| Test-Json -SchemaFile $configurationSchemaFile -ErrorAction SilentlyContinue -ErrorVariable 'validationErrors'

if ($validationErrors) {
    $configurationFileFullPath = $ConfigurationFile | Resolve-Path
    $validationErrorsOutput = $validationErrors | Join-String -Separator "`n"
    Write-Host -ForegroundColor Red "Errors found in configuration file $configurationFileFullPath`:`n$validationErrorsOutput"
}

if ($PassThru) {
    return $testResult
}
