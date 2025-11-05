# LunarMatt

Material You inspired adaptive wallpaper color extraction for VS Code with Catppuccin theming

## Features

- 🎨 **Adaptive Colors**: Extracts vibrant colors from your wallpaper and generates matching VS Code theme colors
- 🌓 **Dark/Light Modes**: Supports both dark and light theme variants
- 🔄 **Auto-Detection**: Automatically detects wallpapers across different desktop environments
- 📊 **Status Management**: Check current theme status and reset customizations
- 🖥️ **Cross-Platform**: Works on Linux, macOS, and Windows
- 🎯 **Catppuccin Integration**: Built on top of Catppuccin themes for consistent theming

## Installation

### Option 1: Install Binary (Recommended)

#### Linux
```bash
git clone https://github.com/haxtechs/lunarmatt.git
cd lunarmatt
npm install
npm run install:linux
```

#### macOS
```bash
git clone https://github.com/haxtechs/lunarmatt.git
cd lunarmatt
npm install
npm run install:macos
```

#### Windows
```cmd
git clone https://github.com/haxtechs/lunarmatt.git
cd lunarmatt
npm install
npm run install:windows
```

### Option 2: Use with Node.js

```bash
npm install -g lunarmatt
```

## Usage

After installation, you can use the `lunarmatt` command from anywhere:

```bash
# Auto-detect wallpaper and apply dark theme
lunarmatt auto dark

# Auto-detect wallpaper and apply light theme
lunarmatt auto light

# Watch for wallpaper changes (dark mode)
lunarmatt watch dark

# Use specific wallpaper file
lunarmatt /path/to/wallpaper.jpg dark

# Check current status
lunarmatt status

# Reset/remove customizations
lunarmatt reset

# Show help
lunarmatt help
```

## Requirements

- **VS Code** with [Catppuccin theme](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc) installed
- **Node.js** 14+ (for development/manual installation)
- Supported desktop environments:
  - **Linux**: GNOME, KDE Plasma, Hyprland, sway
  - **macOS**: Native wallpaper detection
  - **Windows**: Native wallpaper detection

## Supported Wallpaper Sources

### Linux
- **Hyprland**: swww, hyprpaper, quickshell, swaybg
- **GNOME/Unity**: gsettings/dconf
- **KDE Plasma**: KDE configuration files
- **Symlink**: `~/.current_wallpaper` symlink

### macOS & Windows
- Native system wallpaper detection

## Development

```bash
# Clone repository
git clone https://github.com/haxtechs/lunarmatt.git
cd lunarmatt

# Install dependencies
npm install

# Build binaries for all platforms
npm run build:all

# Run in development mode
npm run dark    # Auto-detect dark mode
npm run light   # Auto-detect light mode
npm run watch   # Watch mode dark
```

## Uninstall

### Binary Installation
```bash
npm run uninstall:linux   # Linux
npm run uninstall:macos   # macOS
npm run uninstall:windows # Windows
```

### Node.js Installation
```bash
npm uninstall -g lunarmatt
```

## How It Works

1. **Color Extraction**: Uses `node-vibrant` to extract color palette from wallpaper
2. **Theme Generation**: Generates accent and surface colors based on extracted palette
3. **VS Code Integration**: Applies colors as `workbench.colorCustomizations` that override Catppuccin theme
4. **Preservation**: Safely preserves existing user customizations

## Color Customization

The tool generates colors for 135+ VS Code UI elements including:
- Editor backgrounds and gutters
- Activity bar, status bar, tabs
- Sidebars, panels, buttons
- Syntax highlighting, selections
- And many more...

See `src/scripts/output.md` for a complete reference of all customizable elements.

## Troubleshooting

### Auto-detection not working?
- **Linux**: Create a symlink: `ln -s /path/to/wallpaper.jpg ~/.current_wallpaper`
- **Manual**: Use `lunarmatt /path/to/wallpaper.jpg dark`

### Colors not applying?
- Restart VS Code after running the command
- Ensure Catppuccin theme is installed and selected
- Check status with `lunarmatt status`

### Permission issues?
- Linux/macOS: The installer will request sudo access for system-wide installation
- Windows: Run command prompt as Administrator if needed

### PATH not updated after installation?
- **Bash**: Run `source ~/.bashrc`
- **Zsh**: Run `source ~/.zshrc`
- **Fish**: Run `source ~/.config/fish/config.fish`
- Or restart your terminal

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.


1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<yourusername>/lunarmatt.git
   cd lunarmatt
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Make your changes** and test them

5. **Run the linter**:
   ```bash
   npm run lint
   ```

6. **Submit a pull request** with a clear description of your changes

### Adding New Platforms

To add support for a new platform or wallpaper tool:

1. Create a new detector in `src/detectors/`
2. Extend `BaseDetector` class
3. Implement `detect()` and `isApplicable()` methods
4. Add it to the detector list in the appropriate orchestrator

Example:
```javascript
class NewPlatformDetector extends BaseDetector {
  isApplicable() {
    return process.platform === 'newplatform';
  }

  async detect() {
    // Your detection logic here
    return wallpaperPath;
  }

  getName() {
    return 'NewPlatform';
  }
}
```

## License

MIT License - see LICENSE file for details

<div align="center">

**Made with ❤️ for the VS Code community**

[⭐ Star us on GitHub](https://github.com/haxtechs/lunarmatt) • [🐛 Report a bug](https://github.com/haxtechs/lunarmatt/issues) • [💡 Request a feature](https://github.com/haxtechs/lunarmatt/issues)

</div>
