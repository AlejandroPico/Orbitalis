@echo off
setlocal
cd /d "%~dp0"
start "Orbitalis Server" /min powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/"
endlocal
