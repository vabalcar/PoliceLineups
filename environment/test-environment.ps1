#!/usr/bin/pwsh

function Test-ExecutionPolicy {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)] [string] $ExecutionPolicy
    )
    return ($ExecutionPolicy -ne 'Restricted') -and ($ExecutionPolicy -ne 'AllSigned')
}

function Test-Executable {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)] [string] $Executable
    )

    return Get-Command -CommandType Application -TotalCount 1 -Name $Executable -ErrorAction SilentlyContinue
}

function Test-Environment {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory = $true)] [string] $EnvironmentDescriptionFile
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

$isEnvironmentReady = $true

$currentExecutionPolicy = Get-ExecutionPolicy
if (!(Test-ExecutionPolicy -ExecutionPolicy $currentExecutionPolicy)) {
    "PowerShell execution policy is '$currentExecutionPolicy' which is BAD. Please repair it." | Out-Host
    $isEnvironmentReady = $false
}

$isEnvironmentReady = $isEnvironmentReady -and (Test-Environment -EnvironmentDescriptionFile 'environment-common.csv')
if ($IsWindows) {
    $isEnvironmentReady = $isEnvironmentReady -and (Test-Environment -EnvironmentDescriptionFile 'environment-windows.csv')
}
else {
    $isEnvironmentReady = $isEnvironmentReady -and (Test-Environment -EnvironmentDescriptionFile 'environment-linux.csv')
}

if ($isEnvironmentReady) {
    'Environment is ready.' | Out-Host
}
else {
    'Evironment is not ready. Please follow instructions above and try again.' | Out-Host
}
