#!/usr/bin/pwsh
[CmdletBinding(SupportsShouldProcess)]
param ()

. (Join-Path '..' 'utils' 'git.ps1')

Remove-GitIgnoredFiles
