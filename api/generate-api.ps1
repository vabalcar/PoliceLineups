Param (
    [Parameter(Mandatory = $true)] [string] $dir,
    [Parameter(Mandatory = $true)] [string] $lang,
    [string] $api = 'api.yaml'
)

Write-Output "Generating $lang api in $dir..."
Start-Process -nnw -Wait -Path "java" -Args '-jar', 'swagger-codegen-cli.jar', 'generate', '-i', 'api.yaml', '-o', $dir, '-l', $lang
Write-Output 'done.'