#!/usr/bin/pwsh
function IsInstalled([string] $executable) {
    return Get-Command -CommandType Application -TotalCount 1 -Name $executable -ErrorAction SilentlyContinue;
}

$environmentReady = $true

Import-Csv -Path 'environment.csv' -Delimiter ';' | ForEach-Object {
    if (!(IsInstalled($_.executable))) {
        "$($_.name) is missing in the environment. Please visit $($_.installWebsite) and install it."
        $global:environmentReady = $false
    }
}

if (!$environmentReady) {
    'Evironment is not ready. Please follow instructions above and try again.'
    exit
} else {
    'Environment is ready.'
}