@echo off
REM Lunar Mat Windows Uninstallation Script
REM Removes lunarmatt.exe and cleans up

echo 🗑️  Lunar Mat - Windows Uninstallation
echo =====================================

set "INSTALL_DIR=%ProgramFiles%\LunarMat"
set "BINARY_PATH=%INSTALL_DIR%\lunarmatt.exe"

if exist "%BINARY_PATH%" (
    del "%BINARY_PATH%"
    echo ✅ Removed %BINARY_PATH%
) else (
    echo ℹ️  lunarmatt.exe not found at %BINARY_PATH%
)

REM Reset VS Code customizations
echo Resetting VS Code customizations...
lunarmatt reset 2>nul || echo ℹ️  lunarmatt command not available for reset

echo.
echo ✅ Uninstallation complete!
echo.
echo Note: You may need to restart VS Code to see the changes.
echo The Catppuccin theme will remain installed.
pause