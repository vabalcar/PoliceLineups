using namespace System.IO

function Remove-GitIgnoredFiles {
    [CmdletBinding()]
    param (
        [string] $Path = '.',
        [string] $IgnoreFile = ''
    )
    if ($IgnoreFile -ne '') {
        if ([Path]::IsPathRooted($IgnoreFile)) {
            $IgnoreFile = $IgnoreFile.Substring("$(& git rev-parse --show-toplevel)".Length + 1)
        } else {
            $IgnoreFile = (Join-Path "$(Get-Location)".Substring("$(& git rev-parse --show-toplevel)".Length + 1) $IgnoreFile)
        }
        [string[]] $cleanIgnores = & git ls-files --others --ignored --directory --exclude-from=$IgnoreFile -- $Path
    }
    & git ls-files --others --ignored --directory --exclude-standard -- $Path
        | Where-Object { ($null -eq $cleanIgnores) -or !$cleanIgnores.Contains("$_") }
        | Resolve-Path -Relative
        | ForEach-Object {
            "Removing $_" | Out-Host
            $_
        }
        | Remove-Item -Recurse -Force -WhatIf
}