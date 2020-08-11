using namespace System.Collections.Generic

function Read-GitIgnore {
    [CmdletBinding()]
    [OutputType([string[]])]
    param (
        [string] $IgnoreFile = '',
        [string] $Path = '.',
        [switch] $DirsOnly,
        [switch] $FilesOnly
    )

    if ($DirsOnly -and $FilesOnly) {
        throw [System.ArgumentException]::new()
    }

    $gitLsArgs = @(
        '--others',
        '--ignored',
        ($IgnoreFile -eq '' ? '--exclude-standard' : "--exclude-per-directory=$IgnoreFile")
    )

    $result = [List[string]]::new()

    $dirs = & git ls-files @gitLsArgs --directory -- $Path | Where-Object { Test-Path -PathType Container -Path $_ }

    if (!$FilesOnly) {
        $dirs | ForEach-Object {
            $result.Add($_)
        }
    }

    if ($DirsOnly) {
        return $result
    }

    & git ls-files @gitLsArgs -- $Path
        | ForEach-Object {
            if ($dirs.Length -ne 0) {
                foreach($dir in $dirs) {
                    if ("$_".StartsWith("$dir")) {
                        return
                    }
                }
            }
            $result.Add($_)
        }

    return $result
}

function Remove-GitIgnoredFiles {
    [CmdletBinding()]
    param (
        [string] $Path = '.',
        [string] $CleanIgnoreFile = ''
    )

    $cleanIgnoreFiles = [HashSet[string]]::new()
    if ($CleanIgnoreFile -ne '') {
        $cleanIgnoreDirs = Read-GitIgnore -Path $Path -IgnoreFile $CleanIgnoreFile -DirsOnly
        Read-GitIgnore -Path $Path -IgnoreFile $CleanIgnoreFile -FilesOnly | ForEach-Object { $cleanIgnoreFiles.Add($_) | Out-Null }
    }
    Read-GitIgnore -Path $Path
        | Where-Object {
            if (!$cleanIgnoreDirs) {
                return $true
            }
            foreach($dir in $cleanIgnoreDirs) {
                if ("$_".StartsWith("$dir")) {
                    return $false
                }
            }
            return $true
        }
        | Where-Object { !$cleanIgnoreFiles.Contains($_) }
        | ForEach-Object {
            "Removing $_" | Out-Host
            $_
        }
        | Remove-Item -Recurse -Force
}