#!/usr/bin/pwsh
Param (
    [Parameter(Mandatory=$true)] [string] $outputFile
)

& 'pip' 'install' 'virtualenv'