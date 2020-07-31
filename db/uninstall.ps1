#!/usr/bin/pwsh
. (Join-Path '..' 'pwsh' 'libs' 'git.ps1')

Remove-GitIgnoredFiles -IgnoreFile '.cleanignore'