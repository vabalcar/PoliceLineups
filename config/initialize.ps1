#!/usr/bin/pwsh

function Initialize-EnvironmentConfiguration {
    param (
        [Parameter(Mandatory = $true)] [string] $EnvironmentName
    )

    if (Test-Path -PathType Container -Path $EnvironmentName) {
        "Configuration of environment $EnvironmentName has already been initialized" | Out-Host
        return
    }

    "Intializing default configuration of environment $EnvironmentName..." | Out-Host
    Copy-Item -Recurse -Path 'default' -Destination $EnvironmentName
}

'debug', 'production' | ForEach-Object {
    Initialize-EnvironmentConfiguration -EnvironmentName $_
}
