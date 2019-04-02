Param (
    [Parameter(Mandatory = $true)] [string] $script
)

& (Join-Path . $script)

[Console]::Write('Press any key to close this window...')
$Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown') | Out-Null
$Host.UI.RawUI.Flushinputbuffer()