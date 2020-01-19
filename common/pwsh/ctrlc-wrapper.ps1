Param (
    [Parameter(Mandatory = $true)] [System.Diagnostics.Process] $proc
)

[Console]::TreatControlCAsInput = $true
do {
    $Host.UI.RawUI.FlushInputBuffer()
    $keyPress = $Host.UI.RawUI.ReadKey("AllowCtrlC,IncludeKeyUp,NoEcho")
} while (!($keyPress.Character -eq "`u{0003}"))
$Host.UI.RawUI.FlushInputBuffer()
[Console]::TreatControlCAsInput = $false

if ($IsWindows) {
    & 'taskkill' '/t' '/f' '/PID' $proc.Id
} else {
    # TODO: Add POSIX alternative
}