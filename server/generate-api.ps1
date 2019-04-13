Remove-Item -Recurse -Force -Path (Join-Path '.' 'generated') *> $null
Remove-Item -Recurse -Force -Path (Join-Path '.' 'swagger_server') *> $null
Remove-Item -Recurse -Force -Path (Join-Path '.' 'swagger_server_requirements') *> $null

& (Join-Path '..' 'api' 'generate-api.ps1') -Lang 'python-flask' -Dir 'generated'

Move-Item -Path (Join-Path '.' 'generated' 'swagger_server') -Destination '.'
Copy-Item  -Recurse -Path (Join-Path '.' 'swagger_server_override' '*') -Destination (Join-Path '.' 'swagger_server')

New-Item -Path '.' -ItemType 'directory' -Name 'swagger_server_requirements' | Out-Null
Move-Item -Path (Join-Path '.' 'generated' '*requirements.txt') -Destination (Join-Path '.' 'swagger_server_requirements')

Remove-Item -Recurse -Force -Path (Join-Path '.' 'generated')