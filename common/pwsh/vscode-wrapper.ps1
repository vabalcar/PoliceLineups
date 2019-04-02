Param (
    [Parameter(Mandatory = $true)] [string] $script
)

$wrapper = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'cmd-wrapper.ps1')
Start-Process -Path pwsh -Args "-NoLogo", "-Command", "& $wrapper -Script $script"