#!/usr/bin/pwsh

$defaultEnvironment = 'default'
$configurations = Get-ChildItem -Name -Path (Join-Path $defaultEnvironment '*') -Include '*.json'

'debug', 'production'
| ForEach-Object {
    $environment = $_

    "Checking configuration of environment '$environment'..." | Out-Host

    if (!(Test-Path -PathType Container -Path $environment)) {
        "Initializing configuration of environment '$environment'..." | Out-Host
        Copy-Item -Recurse -Path $defaultEnvironment -Destination $environment -Verbose
        return
    }

    "Configuration of environment '$environment' has already been initialized, searching for missing partial configurations..." | Out-Host

    $environmentConfigurationValid = $true

    $configurations
    | ForEach-Object {
        Join-Path $environment $_
    }
    | Where-Object {
        !(Test-Path -PathType Leaf -Path $_)
    }
    | ForEach-Object {
        $configuration = Split-Path -Leaf $_
        "Configuration of environment '$environment' is missing partial configuration $configuration, fixing it by using default values for $configuration..." | Out-Host

        if ($environmentConfigurationValid) {
            $environmentConfigurationValid = $false
        }

        Copy-Item -Path (Join-Path $defaultEnvironment $configuration) -Destination $_ -Verbose
    }

    if ($environmentConfigurationValid) {
        "Configuration of environment '$environment' is OK" | Out-Host
    }
}
