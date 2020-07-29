function Update-JsonObject {
    param (
        [Parameter(Mandatory=$true)] [string] $Path,
        [Parameter(Mandatory=$true)] [string] $Attribute,
        [Parameter(Mandatory=$true)] $Value
    )

    $jsonObject = Get-Content -Raw -Path $Path | ConvertFrom-Json
    $jsonObject.$Attribute = $Value
    $jsonObject | ConvertTo-Json | Out-File -FilePath $Path
    return $jsonObject
}