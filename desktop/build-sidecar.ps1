# build-sidecar.ps1
# Compila el backend Python con PyInstaller y lo copia al directorio de binarios de Tauri.
# Uso: .\build-sidecar.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$rootDir   = Split-Path $PSScriptRoot -Parent
$backendDir = Join-Path $rootDir "backend"
$binDir    = Join-Path $PSScriptRoot "src-tauri\binaries"

# Obtener el target triple de Rust (ej: x86_64-pc-windows-msvc)
$triple = (rustc -Vv | Select-String "host").ToString().Split(":")[1].Trim()
Write-Host "Target triple: $triple"

# Instalar PyInstaller si no está
python -m pip show pyinstaller | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Instalando PyInstaller..."
    python -m pip install pyinstaller
}

# Compilar el backend
Push-Location $backendDir
Write-Host "Compilando backend con PyInstaller..."
python -m PyInstaller --onefile --noconsole --name backend `
    --hidden-import uvicorn.logging `
    --hidden-import uvicorn.loops `
    --hidden-import uvicorn.loops.auto `
    --hidden-import uvicorn.protocols `
    --hidden-import uvicorn.protocols.http `
    --hidden-import uvicorn.protocols.http.auto `
    --hidden-import uvicorn.protocols.websockets `
    --hidden-import uvicorn.protocols.websockets.auto `
    --hidden-import uvicorn.lifespan `
    --hidden-import uvicorn.lifespan.on `
    --hidden-import passlib.handlers.argon2 `
    main.py
Pop-Location

# Crear directorio de binarios si no existe
New-Item -ItemType Directory -Force -Path $binDir | Out-Null

# Copiar el .exe con el nombre que espera Tauri (backend-TRIPLE.exe)
$src  = Join-Path $backendDir "dist\backend.exe"
$dest = Join-Path $binDir "backend-$triple.exe"
Copy-Item -Force $src $dest
Write-Host "[OK] Sidecar copiado a: $dest"
