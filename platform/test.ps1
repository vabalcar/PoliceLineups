#!/usr/bin/pwsh
param (
    [switch] $PassThru
)

function Test-ExecutionPolicy {
    param (
        [Parameter(Mandatory)] [string] $ExecutionPolicy
    )

    return ($ExecutionPolicy -ne 'Restricted') -and ($ExecutionPolicy -ne 'AllSigned')
}

function Test-Executable {
    param (
        [Parameter(Mandatory)] [string] $Executable
    )

    return Get-Command -CommandType Application -TotalCount 1 -Name $Executable -ErrorAction SilentlyContinue
}

function Test-PlatformExecutables {
    param (
        [Parameter(Mandatory)] [string] $RequiredExecutablesFile
    )

    $allRequiredExecutablesPresent = $true

    $requiredExecutables = Import-Csv -Path $RequiredExecutablesFile -Delimiter ';'
    foreach ($executable in $requiredExecutables) {
        if (Test-Executable -Executable $executable.executable) {
            continue
        }

        "Executable $($executable.name) cannot be found. Please visit $($executable.installWebsite) for more information and install it." | Out-Host
        if ($allRequiredExecutablesPresent) {
            $allRequiredExecutablesPresent = $false
        }
    }

    return $allRequiredExecutablesPresent
}

$pwshExecutionPolicy = Get-ExecutionPolicy
$isPwshReady = Test-ExecutionPolicy -ExecutionPolicy $pwshExecutionPolicy

if (!$isPwshReady) {
    "PowerShell execution policy is '$pwshExecutionPolicy' which is BAD." | Out-Host
    "Please repair it by running 'repair-pwsh-execution-policy.ps1' script." | Out-Host
}

$areCommonExecutablesPresent = Test-PlatformExecutables -RequiredExecutablesFile (Join-Path $PSScriptRoot 'common' 'executables.csv')

$executablesRequiredOnCurrentOs = Join-Path $PSScriptRoot ($IsWindows ? 'windows' : 'linux') 'executables.csv'
$areOsSpecificExecutablesPresent = Test-PlatformExecutables -RequiredExecutablesFile $executablesRequiredOnCurrentOs

$isPlatformReady = $isPwshReady -and $areCommonExecutablesPresent -and $areOsSpecificExecutablesPresent

if ($isPlatformReady) {
    'Platform is ready.' | Out-Host
}
else {
    Write-Host -ForegroundColor Red 'Platform is not ready. Please follow instructions above and try again.'
}

if ($PassThru) {
    return $isPlatformReady
}
