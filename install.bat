@echo off
REM =============================================================
REM  Lunar Mat Windows Installation Script (System PATH version)
REM =============================================================

echo 🚀 Lunar Mat - Windows Installation
echo ===================================

REM Set script directory as root
set "SCRIPT_DIR=%~dp0"

REM Check if binary exists
if not exist "%SCRIPT_DIR%dist\lunarmatt-win.exe" (
    echo Building binary...
    npm run build:windows
)

REM Define install directory
set "INSTALL_DIR=%ProgramFiles%\LunarMat"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo Installing to: %INSTALL_DIR%

REM Copy binary
copy "%SCRIPT_DIR%dist\lunarmatt-win.exe" "%INSTALL_DIR%\lunarmatt.exe" >nul

REM Use PowerShell to check and modify the SYSTEM PATH safely
echo Checking system PATH...
powershell -Command ^
    "$installDir='%INSTALL_DIR%';" ^
    "$currentPath=[Environment]::GetEnvironmentVariable('Path','Machine');" ^
    "if (-not ($currentPath -split ';' | ForEach-Object { $_.Trim() } | Where-Object { $_ -eq $installDir })) {" ^
    "    [Environment]::SetEnvironmentVariable('Path', $currentPath + ';' + $installDir, 'Machine');" ^
    "    Write-Host '✅ Added to SYSTEM PATH successfully.'" ^
    "} else {" ^
    "    Write-Host 'ℹ️  Already present in SYSTEM PATH.'" ^
    "}"

echo.
echo ✅ Installation complete!
echo.
echo You can now use 'lunarmatt' from anywhere:
echo   lunarmatt help
echo   lunarmatt auto dark
echo   lunarmatt status
echo   lunarmatt reset
echo.
echo ⚠️  Please restart your Command Prompt or PowerShell for the changes to take effect.
pause