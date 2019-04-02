Param (
    [Parameter(Mandatory = $true)] [System.Diagnostics.Process] $proc
)

[Console]::TreatControlCAsInput = $true
do {
    $Host.UI.RawUI.FlushInputBuffer()
    $keyPress = $Host.UI.RawUI.ReadKey("AllowCtrlC,IncludeKeyUp,NoEcho")
    $leftCtrlPressed = $keyPress.ControlKeyState -eq ($keyPress.ControlKeyState -bor [System.Management.Automation.Host.ControlKeyStates]::LeftCtrlPressed)
    $rightCtrlPressed = $keyPress.ControlKeyState -eq ($keyPress.ControlKeyState -bor [System.Management.Automation.Host.ControlKeyStates]::RightCtrlPressed)
    $ctrlPressed =  $leftCtrlPressed -or $rightCtrlPressed
    $cPressed = $keyPress.VirtualKeyCode -eq 0x43
} while (!($ctrlPressed -and $cPressed));
$Host.UI.RawUI.FlushInputBuffer()
[Console]::TreatControlCAsInput = $false

if ($IsWindows) {
    Start-Process -nnw -Wait -Path 'taskkill' -Args '/t', '/f', '/PID', $proc.Id
} else {
    # TODO: Add POSIX alternative
}