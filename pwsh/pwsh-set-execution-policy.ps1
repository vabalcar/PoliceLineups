#!/usr/bin/pwsh
$executionPolicy = Get-ExecutionPolicy
if(("$executionPolicy" -eq 'Restricted') -or ("$executionPolicy" -eq 'AllSigned')) {
    if ($IsWindows) {
        Start-Process -Wait -Verb RunAs -Path 'pwsh' -Args '-NoLogo', '-Command', 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned'
    } else {
        & sudo pwsh -NoLogo -Command 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned'
    }
}
"PowerShell execution policy is set to '$executionPolicy'." | Out-Host