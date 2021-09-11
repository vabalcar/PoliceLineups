#!/usr/bin/pwsh
function Test-Executable() {
    param (
        [Parameter(Mandatory = $true)] [string] $Executable
    )

    return Get-Command -CommandType Application -TotalCount 1 -Name $Executable -ErrorAction SilentlyContinue
}

$environmentReady = $true

$executableDescriptions = Import-Csv -Path 'environment.csv' -Delimiter ';'
foreach ($description in $executableDescriptions) {
    if (!(Test-Executable -Executable $description.executable)) {
        "$($description.name) is missing in the environment. Please visit $($description.installWebsite) and install it." | Out-Host
        if ($environmentReady) {
            $environmentReady = $false
        }
    }
}

if (!$environmentReady) {
    'Evironment is not ready. Please follow instructions above and try again.' | Out-Host
}
else {
    'Environment is ready.' | Out-Host
}
