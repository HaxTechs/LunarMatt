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
    // Marker to identify the customizations
    this.LUNAR_MAT_MARKER = '__lunar_mat_generated__';
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
   * Apply theme colors while preserving existing customizations
   * @param {Object} newTheme - New theme configuration
   */
  applyTheme(newTheme) {
    const existingSettings = this.read();
    
    // Get existing color customizations (non-Lunar Mat ones)
    const existingColors = existingSettings['workbench.colorCustomizations'] || {};
    
    // Remove old Lunar Mat customizations
    const preservedColors = this.removeOurCustomizations(existingColors);
    
    // Add marker to the new customizations
    const markedNewColors = {
      ...newTheme['workbench.colorCustomizations'],
      [this.LUNAR_MAT_MARKER]: true,
    };
    
    // Merge: existing settings + preserved colors + new colors
    const finalSettings = {
      ...existingSettings,
      'workbench.colorTheme': newTheme['workbench.colorTheme'],
      'workbench.colorCustomizations': {
        ...preservedColors,
        ...markedNewColors,
      },
    };
    
    this.write(finalSettings);
  }

  /**
   * Remove Lunar Mat customizations from color object
   * @param {Object} colors - Color customizations object
   * @returns {Object} Colors without Lunar Mat customizations
   */
  removeOurCustomizations(colors) {
    const cleaned = { ...colors };
    
    // If marker exists, this whole object is ours - return empty
    if (cleaned[this.LUNAR_MAT_MARKER]) {
      return {};
    }
    
    // Otherwise, keep all existing customizations
    return cleaned;
  }

  /**
   * Reset - remove all Lunar Mat customizations
   * @returns {boolean} True if reset was successful
   */
  reset() {
    try {
      const existingSettings = this.read();
      
      if (!existingSettings['workbench.colorCustomizations']) {
        Logger.info('No color customizations found');
        return true;
      }
      
      const existingColors = existingSettings['workbench.colorCustomizations'];
      
      // Check if we have any Lunar Mat customizations
      if (!existingColors[this.LUNAR_MAT_MARKER]) {
        Logger.info('No Lunar Mat customizations found');
        return true;
      }
      
      // Remove our customizations
      const cleanedColors = this.removeOurCustomizations(existingColors);
      
      // If no other customizations exist, remove the key entirely
      const finalSettings = { ...existingSettings };
      
      if (Object.keys(cleanedColors).length === 0) {
        delete finalSettings['workbench.colorCustomizations'];
        Logger.info('Removed all color customizations');
      } else {
        finalSettings['workbench.colorCustomizations'] = cleanedColors;
        Logger.info('Removed Lunar Mat customizations, preserved others');
      }
      
      this.write(finalSettings);
      Logger.success('Reset complete! Restart VS Code to see changes.');
      
      return true;
    } catch (error) {
      Logger.error(`Reset failed: ${error.message}`);
      return false;
    }
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

  /**
   * Show current status of Lunar Mat customizations
   */
  showStatus() {
    try {
      const settings = this.read();
      const colors = settings['workbench.colorCustomizations'] || {};
      
      if (colors[this.LUNAR_MAT_MARKER]) {
        Logger.info('✅ Lunar Mat customizations are active');
        Logger.info(`Theme: ${settings['workbench.colorTheme'] || 'Unknown'}`);
        
        // Count our customizations
        const ourKeys = Object.keys(colors).filter(k => k !== this.LUNAR_MAT_MARKER);
        Logger.info(`Customized colors: ${ourKeys.length}`);
      } else {
        Logger.info('❌ No Lunar Mat customizations found');
      }
    } catch (error) {
      Logger.error(`Failed to check status: ${error.message}`);
    }
  }
}

module.exports = SettingsManager;