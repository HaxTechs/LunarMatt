const os = require('os');
const path = require('path');

/**
 * Application configuration constants
 */
module.exports = {
  // Supported image formats
  SUPPORTED_FORMATS: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],

  // Watch mode interval (milliseconds)
  WATCH_INTERVAL: 5000,

  // VS Code settings paths by platform
  VSCODE_SETTINGS_PATHS: {
    win32: path.join(os.homedir(), 'AppData/Roaming/Code/User/settings.json'),
    darwin: path.join(os.homedir(), 'Library/Application Support/Code/User/settings.json'),
    linux: path.join(os.homedir(), '.config/Code/User/settings.json'),
  },

  // Catppuccin theme names
  CATPPUCCIN_THEMES: {
    dark: 'Catppuccin Mocha',
    light: 'Catppuccin Latte',
  },

  // Symlink paths for active wallpaper (checked in order)
  SYMLINK_PATHS: [
    path.join(os.homedir(), '.current_wallpaper'),
    path.join(os.homedir(), '.cache/current_wallpaper'),
    path.join(os.homedir(), '.cache/wallpaper'),
    path.join(os.homedir(), '.cache/quickshell/current_wallpaper'),
    path.join(os.homedir(), '.local/share/wallpapers/current'),
  ],

  // Hyprland config paths
  HYPRLAND_PATHS: {
    config: path.join(os.homedir(), '.config/hypr/hyprland.conf'),
    hyprpaper: path.join(os.homedir(), '.config/hypr/hyprpaper.conf'),
  },

  // QuickShell config paths
  QUICKSHELL_PATHS: [
    path.join(os.homedir(), '.config/quickshell/wallpaper'),
    path.join(os.homedir(), '.config/quickshell/current_wallpaper'),
  ],
};