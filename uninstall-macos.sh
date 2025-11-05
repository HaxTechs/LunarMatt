#!/bin/bash

# Lunar Mat macOS Uninstallation Script
# Removes the lunarmatt binary and cleans up

set -e

echo "🗑️  Lunar Mat - macOS Uninstallation"
echo "==================================="

INSTALL_DIR="/usr/local/bin"
BINARY_PATH="$INSTALL_DIR/lunarmatt"

if [ -f "$BINARY_PATH" ]; then
    if [ ! -w "$INSTALL_DIR" ]; then
        echo "Requesting sudo access to remove from $INSTALL_DIR..."
        sudo rm "$BINARY_PATH"
    else
        rm "$BINARY_PATH"
    fi
    echo "✅ Removed $BINARY_PATH"
else
    echo "ℹ️  lunarmatt binary not found at $BINARY_PATH"
fi

# Reset VS Code customizations
echo "Resetting VS Code customizations..."
if command -v lunarmatt &> /dev/null; then
    lunarmatt reset 2>/dev/null || true
else
    echo "ℹ️  lunarmatt command not available for reset"
fi

echo ""
echo "✅ Uninstallation complete!"
echo ""
echo "Note: You may need to restart VS Code to see the changes."
echo "The Catppuccin theme will remain installed."