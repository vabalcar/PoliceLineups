#!/usr/bin/pwsh

function Test-Executable {
    [CmdletBinding()]
    [OutputType([bool])]
    param (
        [Parameter(Mandatory = $true)] [string] $Executable
    )

    return (Get-Command -CommandType Application -TotalCount 1 -Name $Executable -ErrorAction SilentlyContinue)
}

function Initialize-Update {
    param (
        [Parameter(Mandatory = $true)] [string] $Executable
    )

    if (!(Test-Executable -Executable $Executable)) {
        $message = "$Executable is not present in this this environment, skipping..."
        $continue = $false
    }
    else {
        $message = "Updating $Executable packages..."
        $continue = $true
    }

    return @{
        message  = $message;
        continue = $continue
    }
}

function Update-PipPackages {
    param (
        [string] $TargetPythonVersion = ''
    )

    $targetPip = "pip$TargetPythonVersion"
    $initResult = Initialize-Update -Executable $targetPip
    $initResult.message
    if (!$initResult.continue) { return }

    $pipCommonOptions = @(
        '--disable-pip-version-check',
        '--no-python-version-warning'
    )

    (($outdatedPackages = & $targetPip @pipCommonOptions list --outdated --not-required --format=json | ConvertFrom-Json) | Out-Null) *>&1
    if ($outdatedPackages.Length -ne 0) {
        foreach ($package in $outdatedPackages) {
            if ($package.latest_filetype -eq 'sdist') {
                "Skipping $($package.name)"
                continue
            }
            if (($package.name -eq 'pip') -and $IsWindows) {
                & python -m pip @pipCommonOptions install --upgrade pip *>&1
            }
            else {
                & $targetPip @pipCommonOptions install --upgrade $package.name *>&1
            }
        }
    }
    else {
        "Everything installed using $targetPip is up to date"
    }
}

& (Join-Path '.' 'activate.ps1')

'Updating server...' | Out-Host
Update-PipPackages
'done.' | Out-Host

& pip freeze > requirements.txt

& deactivate
