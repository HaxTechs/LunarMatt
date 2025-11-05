#!/bin/bash

# Lunar Mat macOS Installation Script
# Installs the lunarmatt binary to /usr/local/bin

set -e

echo "🚀 Lunar Mat - macOS Installation"
echo "================================="

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    INSTALL_DIR="/usr/local/bin"
else
    INSTALL_DIR="/usr/local/bin"

    # Try to create directory with sudo if needed
    if [ ! -w "/usr/local/bin" ]; then
        echo "Requesting sudo access to install to /usr/local/bin..."
        sudo mkdir -p "/usr/local/bin"
        SUDO_CMD="sudo"
    fi
fi

echo "Installing to: $INSTALL_DIR"

# Build the binary if not already built
if [ ! -f "dist/LunarMatt-macos" ]; then
    echo "Building binary..."
    npm run build:macos
fi

# Copy binary
$SUDO_CMD cp dist/LunarMatt-macos "$INSTALL_DIR/lunarmatt"
$SUDO_CMD chmod +x "$INSTALL_DIR/lunarmatt"

echo "✅ Installation complete!"
echo ""
echo "You can now use 'lunarmatt' from anywhere:"
echo "  lunarmatt help          # Show help"
echo "  lunarmatt auto dark     # Auto-detect wallpaper and apply theme"
echo "  lunarmatt status        # Check current status"
echo "  lunarmatt reset         # Remove customizations"
echo ""
echo "Restart your terminal or run 'source ~/.bashrc' (or equivalent) to update PATH."