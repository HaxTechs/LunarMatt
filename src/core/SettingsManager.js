const fs = require('fs');
const path = require('path');
const { VSCODE_SETTINGS_PATHS } = require('../config/constants');
const Logger = require('../utils/Logger');

/**
 * VS Code settings.json manager
 * Handles reading and writing VS Code configuration
 */
class SettingsManager {
  constructor() {
    this.settingsPath = VSCODE_SETTINGS_PATHS[process.platform] || VSCODE_SETTINGS_PATHS.linux;
  }

  /**
   * Read existing VS Code settings
   * @returns {Object} Parsed settings object
   */
  read() {
    try {
      if (fs.existsSync(this.settingsPath)) {
        const content = fs.readFileSync(this.settingsPath, 'utf8');
        return JSON.parse(content);
      }
      
      Logger.warning('VS Code settings.json not found, creating new file');
      return {};
    } catch (error) {
      Logger.warning(`Could not read settings: ${error.message}`);
      return {};
    }
  }

  /**
   * Write settings to VS Code settings.json
   * @param {Object} settings - Settings object to write
   */
  write(settings) {
    try {
      const dir = path.dirname(this.settingsPath);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write settings with formatting
      fs.writeFileSync(
        this.settingsPath,
        JSON.stringify(settings, null, 2),
        'utf8'
      );
      
      Logger.success('Settings applied successfully!');
      Logger.info(`Location: ${this.settingsPath}`);
    } catch (error) {
      throw new Error(`Failed to write settings: ${error.message}`);
    }
  }

  /**
   * Merge new color customizations with existing settings
   * @param {Object} existingSettings - Current VS Code settings
   * @param {Object} newColorCustomizations - New color overrides
   * @returns {Object} Merged settings
   */
  merge(existingSettings, newColorCustomizations) {
    return {
      ...existingSettings,
      'workbench.colorCustomizations': {
        ...(existingSettings['workbench.colorCustomizations'] || {}),
        ...newColorCustomizations,
      },
    };
  }

  /**
   * Check if Catppuccin theme is installed
   * @param {Object} settings - VS Code settings
   * @returns {boolean} True if Catppuccin is detected
   */
  checkCatppuccinTheme(settings) {
    const currentTheme = settings['workbench.colorTheme'] || '';
    const isCatppuccin = currentTheme.toLowerCase().includes('catppuccin');
    
    if (!isCatppuccin) {
      Logger.warning('Catppuccin theme not detected!');
      Logger.warning('This script works best with Catppuccin as the base theme.');
      Logger.tip('Install from: https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc');
      Logger.warning('The script will still apply color overrides, but results may vary.');
      Logger.separator();
    }
    
    return isCatppuccin;
  }

  /**
   * Get the settings file path
   * @returns {string} Path to settings.json
   */
  getPath() {
    return this.settingsPath;
  }
}

module.exports = SettingsManager;