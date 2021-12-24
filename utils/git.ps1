using namespace System.Collections.Generic

function Remove-GitIgnoredFiles {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [string] $Path = '.',
        [string] $ExclusionsFile
    )

    if (!$ExclusionsFile) {
        Read-GitIgnore -Path $Path
        | Remove-Item -Recurse -Force -Verbose
        return
    }

    $excludedDirs = Read-GitIgnore -Path $Path -ExclusionsFile $ExclusionsFile -DirsOnly

    $excludedFiles = [HashSet[string]]::new()
    Read-GitIgnore -Path $Path -ExclusionsFile $ExclusionsFile -FilesOnly | ForEach-Object { $excludedFiles.Add($_) | Out-Null }

    Read-GitIgnore -Path $Path
    | Skip-Prefixed -Prefixes $excludedDirs
    | Where-Object { !$excludedFiles.Contains($_) }
    | Remove-Item -Recurse -Force -Verbose
}

function Read-GitIgnore {
    [OutputType([string[]])]
    param (
        [string] $Path = '.',
        [switch] $DirsOnly,
        [switch] $FilesOnly,
        [string] $ExclusionsFile
    )

    if ($DirsOnly -and $FilesOnly) {
        throw [System.ArgumentException]::new()
    }

    $gitLsArgs = @(
        '--others',
        '--ignored',
        ($ExclusionsFile ? "--exclude-per-directory=$ExclusionsFile" : '--exclude-standard')
    )

    [array] $ignoredDirs = & git ls-files @gitLsArgs --directory -- $Path | Where-Object { Test-Path -PathType Container -Path $_ }
    $ignoredDirs ??= @()

    if ($DirsOnly) {
        return $ignoredDirs
    }

    [array] $ignoredFiles = & git ls-files @gitLsArgs -- $Path | Skip-Prefixed -Prefixes $ignoredDirs
    $ignoredFiles ??= @()

    if ($FilesOnly) {
        return $ignoredFiles
    }

    return $ignoredDirs + $ignoredFiles
}

function Skip-Prefixed {
    param (
        [Parameter(ValueFromPipeline)] [string[]] $String,
        [string[]] $Prefixes
    )

    process {
        if (!$Prefixes) {
            return $_
        }

        foreach ($prefix in $Prefixes) {
            if ($_.StartsWith($prefix)) {
                return
            }
        }

        return $_
    }
}
