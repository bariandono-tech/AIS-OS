@echo off
echo =======================================================
echo Building Makalah SIM (Sistem Informasi Manajemen)
echo Ajie Bariandono - Universitas Panca Bhakti
echo =======================================================
echo.

cd /d "%~dp0"

if not exist node_modules (
    echo Installing dependencies (docx)...
    call npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Running builder script...
node build_makalah_sim.js

echo.
echo =======================================================
echo Build process complete.
echo =======================================================
pause
