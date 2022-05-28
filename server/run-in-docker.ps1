param(
    [switch] $Debug
)

$dockerComposeArgs = @(
    'compose',
    '--file', 'compose.yaml',
    '--profile', ($Debug ? 'debug' : 'production'),
    'up',
    '--wait'
)
Start-Process -Wait -NoNewWindow -WorkingDirectory $PSScriptRoot -Path 'docker' -ArgumentList $dockerComposeArgs
