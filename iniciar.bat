@echo off
title Central de Chamadas
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale a versao LTS em https://nodejs.org e execute novamente.
  start "" https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias, aguarde...
  call npx -y pnpm@10 install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)

start "" /b powershell -NoProfile -WindowStyle Hidden -Command "while ($true) { try { Invoke-WebRequest http://localhost:3000/api/clinic -UseBasicParsing -TimeoutSec 60 | Out-Null; break } catch { Start-Sleep 1 } }; Start-Process http://localhost:3000"

echo Iniciando em http://localhost:3000 (feche esta janela para encerrar)
call npx -y pnpm@10 dev
pause
