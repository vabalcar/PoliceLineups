#!/usr/bin/pwsh
Get-ChildItem -Path 'default' -File -Filter '*.json' | ForEach-Object {
    $newFileName = $_.Name
    if (!(Test-Path -PathType Leaf -Path $newFileName)) {
        "Creating $newFileName" | Out-Host
        Copy-Item -Path $_ -Destination $newFileName
    }
    else {
        "$newFileName already exists." | Out-Host
    }
}
