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

function Test-Environment {
    param (
        [Parameter(Mandatory)] [string] $EnvironmentDescriptionFile
    )

    $isTestedEnvironmentReady = $true

    $environmentDescription = Import-Csv -Path $EnvironmentDescriptionFile -Delimiter ';'
    foreach ($executableDescription in $environmentDescription) {
        if (!(Test-Executable -Executable $executableDescription.executable)) {
            "$($executableDescription.name) is missing in the environment. Please visit $($executableDescription.installWebsite) for more information and install it." | Out-Host
            if ($isTestedEnvironmentReady) {
                $isTestedEnvironmentReady = $false
            }
        }
    }

    return $isTestedEnvironmentReady
}

$pwshExecutionPolicy = Get-ExecutionPolicy
$isPwshReady = Test-ExecutionPolicy -ExecutionPolicy $pwshExecutionPolicy

if (!$isPwshReady) {
    "PowerShell execution policy is '$pwshExecutionPolicy' which is BAD." | Out-Host
    "Please repair it by running 'repair-pwsh-execution-policy.ps1' script." | Out-Host
}

$isCommonEnvironmentReady = Test-Environment -EnvironmentDescriptionFile (Join-Path $PSScriptRoot 'environment-common.csv')

$currentOSEnvironment = $IsWindows ? 'environment-windows.csv' : 'environment-linux.csv'
$isCurrentOSEnvironmentReady = Test-Environment -EnvironmentDescriptionFile (Join-Path $PSScriptRoot $currentOSEnvironment)

$isEnvironmentReady = $isPwshReady -and $isCommonEnvironmentReady -and $isCurrentOSEnvironmentReady

if ($isEnvironmentReady) {
    'Environment is ready.' | Out-Host
}
else {
    'Evironment is not ready. Please follow instructions above and try again.' | Out-Host
}

if ($PassThru) {
    return $isEnvironmentReady
}
