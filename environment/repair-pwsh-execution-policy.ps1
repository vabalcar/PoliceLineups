#!/usr/bin/pwsh

function Test-ExecutionPolicy {
    param (
        [Parameter(Mandatory = $true)] [string] $ExecutionPolicy
    )
    return ($ExecutionPolicy -ne 'Restricted') -and ($ExecutionPolicy -ne 'AllSigned')
}

function Repair-ExecutionPolicy {
    if ($IsWindows) {
        Start-Process -Wait -Verb RunAs -Path 'pwsh' -Args '-NoLogo', '-Command', 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned'
    }
    else {
        & sudo pwsh -NoLogo -Command 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned'
    }
}

$currentExecutionPolicy = Get-ExecutionPolicy
if (Test-ExecutionPolicy -ExecutionPolicy $currentExecutionPolicy) {
    "PowerShell execution policy is '$currentExecutionPolicy' which is OK" | Out-Host
    exit
}

Repair-ExecutionPolicy
"PowerShell execution policy has been updated to '$(Get-ExecutionPolicy)'." | Out-Host
