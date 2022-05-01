param (
    [Parameter(Mandatory)] [string] $ServiceName,
    [switch] $PassThru
)

$isServiceRunning = $false

if ($IsWindows) {
    $service = Get-Service $ServiceName -ErrorAction SilentlyContinue
    if ($null -eq $service) {
        "Service $ServiceName doesn't exist" | Out-Host
        if ($PassThru) {
            return $false
        }
        exit
    }

    $dbStatus = $service.Status
    $isServiceRunning = $dbStatus -eq 'Running'

    if (!$isServiceRunning) {
        Start-Process -Wait -Verb RunAs -FilePath 'pwsh' -Args '-NoLogo', '-Command', "Start-Service $service"
        $dbStatus = (Get-Service $service).Status
        $isServiceRunning = $dbStatus -eq 'Running'
    }

    "Service $service is $($dbStatus.ToString().ToLower())" | Out-Host
}
else {
    & sudo service $ServiceName start
    $isServiceRunning = $true
}

if ($PassThru) {
    return $isServiceRunning
}
