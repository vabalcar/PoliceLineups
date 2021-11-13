#!/usr/bin/pwsh
param (
    [switch] $Debug
)

. (Join-Path '..' 'utils' 'tasks.ps1')

Invoke-Rebuild -Debug:$Debug
