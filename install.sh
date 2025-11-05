#!/bin/bash

# Lunar Mat Installation Script
# Installs the lunarmatt binary to /usr/local/bin

set -e

echo "🚀 Lunar Mat - Installation Script"
echo "=================================="

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    INSTALL_DIR="/usr/local/bin"
else
    INSTALL_DIR="$HOME/.local/bin"

    # Create directory if it doesn't exist
    mkdir -p "$INSTALL_DIR"

    # Add to PATH if not already there
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        echo "Adding $INSTALL_DIR to PATH..."

        # Bash
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc"

        # Zsh
        if [[ -f "$HOME/.zshrc" ]]; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.zshrc"
        fi

        # Fish
        if command -v fish &> /dev/null; then
            mkdir -p "$HOME/.config/fish"
            echo 'set -x PATH $HOME/.local/bin $PATH' >> "$HOME/.config/fish/config.fish"
        fi

        export PATH="$INSTALL_DIR:$PATH"
    fi
fi

echo "Installing to: $INSTALL_DIR"

# Build the binary if not already built
if [ ! -f "dist/lunarmatt" ]; then
    echo "Building binary..."
    npm run build:linux
fi

# Copy binary
cp dist/lunarmatt "$INSTALL_DIR/lunarmatt"
chmod +x "$INSTALL_DIR/lunarmatt"

echo "✅ Installation complete!"
echo ""
echo "You can now use 'lunarmatt' from anywhere:"
echo "  lunarmatt help          # Show help"
echo "  lunarmatt auto dark     # Auto-detect wallpaper and apply theme"
echo "  lunarmatt status        # Check current status"
echo "  lunarmatt reset         # Remove customizations"
echo ""
echo "Restart your terminal or run 'source ~/.bashrc' to update PATH."