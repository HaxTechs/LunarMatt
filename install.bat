@echo off
REM Lunar Mat Windows Installation Script
REM Installs lunarmatt.exe to a directory in PATH

echo 🚀 Lunar Mat - Windows Installation
echo ===================================

REM Check if binary exists
if not exist "dist\LunarMatt-win.exe" (
    echo Building binary...
    npm run build:windows
)

REM Find a suitable installation directory
set "INSTALL_DIR=%USERPROFILE%\bin"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

echo Installing to: %INSTALL_DIR%

REM Copy binary
copy "dist\LunarMatt-win.exe" "%INSTALL_DIR%\lunarmatt.exe" >nul

REM Check if INSTALL_DIR is in PATH
echo %PATH% | find /i "%INSTALL_DIR%" >nul
if errorlevel 1 (
    echo Adding %INSTALL_DIR% to PATH...
    setx PATH "%PATH%;%INSTALL_DIR%" >nul
    echo Please restart your command prompt to use 'lunarmatt'
)

echo.
echo ✅ Installation complete!
echo.
echo You can now use 'lunarmatt' from anywhere:
echo   lunarmatt help          # Show help
echo   lunarmatt auto dark     # Auto-detect wallpaper and apply theme
echo   lunarmatt status        # Check current status
echo   lunarmatt reset         # Remove customizations
echo.
echo Restart your command prompt or PowerShell to update PATH.
pause