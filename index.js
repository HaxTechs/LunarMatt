#!/usr/bin/env node

/**
 * Lunar Mat - Adaptive Wallpaper Theme for VS Code
 * Material You inspired color extraction with Catppuccin base
 */

const WindowsDetector = require('./src/detectors/WindowsDetector');
const MacDetector = require('./src/detectors/MacDetector');
const LinuxDetector = require('./src/detectors/LinuxDetector');
const ColorExtractor = require('./src/core/ColorExtractor');
const ThemeGenerator = require('./src/core/ThemeGenerator');
const SettingsManager = require('./src/core/SettingsManager');
const WatchManager = require('./src/core/WatchManager');
const Logger = require('./src/utils/Logger');
const { SUPPORTED_FORMATS } = require('./src/config/constants');
const fs = require('fs');
const path = require('path');

/**
 * Main Application Class
 */
class LunarMat {
  constructor(wallpaperPath, mode) {
    this.wallpaperPath = wallpaperPath;
    this.mode = mode || 'dark';
    this.isWatchMode = wallpaperPath === 'watch';
    
    // Initialize components
    this.colorExtractor = new ColorExtractor();
    this.settingsManager = new SettingsManager();
    this.wallpaperDetector = this.initializeDetector();
  }

  /**
   * Initialize appropriate wallpaper detector based on platform
   */
  initializeDetector() {
    const detectors = [
      new WindowsDetector(),
      new MacDetector(),
      new LinuxDetector(),
    ];

    for (const detector of detectors) {
      if (detector.isApplicable()) {
        return detector;
      }
    }

    throw new Error('No suitable wallpaper detector found for this platform');
  }

  /**
   * Get wallpaper path (auto-detect or manual)
   */
  async getWallpaperPath() {
    if (this.wallpaperPath === 'auto' || this.wallpaperPath === 'watch') {
      if (!this.isWatchMode) {
        Logger.searching('Auto-detecting wallpaper...');
      }

      const wallpaperPath = await this.wallpaperDetector.detect();

      if (!wallpaperPath) {
        throw new Error(
          'Failed to auto-detect wallpaper.\n\n' +
          '💡 Solutions:\n' +
          '   1. Create a symlink: ln -s /path/to/wallpaper.jpg ~/.current_wallpaper\n' +
          '   2. Provide path manually: node index.js /path/to/wallpaper.jpg dark\n' +
          '   3. Check README for platform-specific setup'
        );
      }

      // Validate file exists and format
      if (!fs.existsSync(wallpaperPath)) {
        throw new Error(`Detected wallpaper file doesn't exist: ${wallpaperPath}`);
      }

      const ext = path.extname(wallpaperPath).toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        throw new Error(
          `Unsupported image format: ${ext}\n` +
          `Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
        );
      }

      if (!this.isWatchMode) {
        Logger.success(`Detected (${this.wallpaperDetector.getName()}): ${wallpaperPath}`);
      }

      return wallpaperPath;
    } else {
      // Manual path provided
      if (!fs.existsSync(this.wallpaperPath)) {
        throw new Error(`Wallpaper file not found: ${this.wallpaperPath}`);
      }

      const ext = path.extname(this.wallpaperPath).toLowerCase();
      if (!SUPPORTED_FORMATS.includes(ext)) {
        throw new Error(
          `Unsupported image format: ${ext}\n` +
          `Supported formats: ${SUPPORTED_FORMATS.join(', ')}`
        );
      }

      return this.wallpaperPath;
    }
  }

  /**
   * Apply theme based on wallpaper
   */
  async applyTheme(wallpaperPath) {
    // Extract colors
    const palette = await this.colorExtractor.extract(wallpaperPath);

    // Generate theme
    const themeGenerator = new ThemeGenerator(palette, this.mode);
    const theme = themeGenerator.generate();

    // Read existing settings and check for Catppuccin
    const existingSettings = this.settingsManager.read();
    this.settingsManager.checkCatppuccinTheme(existingSettings);

    // Apply theme (preserves existing customizations)
    this.settingsManager.applyTheme(theme);
  }

  /**
   * Reset - remove Lunar Mat customizations
   */
  reset() {
    try {
      Logger.header('🔄 Lunar Mat - Reset');
      Logger.info('Removing Lunar Mat customizations...');
      Logger.separator();

      const success = this.settingsManager.reset();

      if (success) {
        Logger.separator();
        Logger.success('Reset complete!');
        Logger.info('Your other VS Code customizations have been preserved.');
        Logger.separator();
        Logger.info('💡 Tip: Restart VS Code to see changes');
        Logger.separator();
      }

      return success;
    } catch (error) {
      Logger.error(`Reset failed: ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * Show status of Lunar Mat customizations
   */
  status() {
    Logger.header('📊 Lunar Mat - Status');
    this.settingsManager.showStatus();
    Logger.separator();
  }

  /**
   * Run in one-shot mode
   */
  async run() {
    try {
      Logger.header('🚀 Lunar Mat - Adaptive Wallpaper Theme');
      Logger.info(`Mode: ${this.mode}`);
      Logger.separator();

      // Get wallpaper path
      const wallpaperPath = await this.getWallpaperPath();

      // Apply theme
      await this.applyTheme(wallpaperPath);

      // Success message
      Logger.separator();
      Logger.success('Accent and surface colors applied!');
      Logger.separator();

      this.printUsageInstructions();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Run in watch mode
   */
  async watch() {
    try {
      Logger.header('🚀 Lunar Mat - Watch Mode');
      Logger.info(`Mode: ${this.mode}`);
      Logger.separator();

      const watchManager = new WatchManager(
        () => this.getWallpaperPath(),
        (wallpaperPath) => this.applyTheme(wallpaperPath)
      );

      await watchManager.start();
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Print usage instructions
   */
  printUsageInstructions() {
    Logger.info('💡 Tips:');
    console.log('   - Restart VS Code to see changes');
    console.log('   - Make sure Catppuccin theme is installed');
    console.log('   - Try different wallpapers for different vibes');
    Logger.separator();

    Logger.info('🔄 Usage:');
    console.log('   Auto-detect:  node index.js auto dark');
    console.log('   Auto-detect:  node index.js auto light');
    console.log('   Watch mode:   node index.js watch dark');
    console.log('   Watch mode:   node index.js watch light');
    console.log('   Manual:       node index.js /path/to/wallpaper.jpg dark');
    Logger.separator();

    const oppositeMode = this.mode === 'dark' ? 'light' : 'dark';
    Logger.info(`🌓 Switch to ${oppositeMode} mode:`);
    console.log(`   node index.js ${this.wallpaperPath} ${oppositeMode}`);
    Logger.separator();
  }

  /**
   * Handle errors
   */
  handleError(error) {
    Logger.separator();
    Logger.error(`Error: ${error.message}`);
    Logger.separator();

    if (error.message.includes('auto-detect')) {
      Logger.tip('Try providing the wallpaper path manually:');
      console.log('   node index.js /path/to/wallpaper.jpg dark');
      Logger.separator();
    }

    process.exit(1);
  }
}

/**
 * CLI Entry Point
 */
function printHelp() {
  console.log('Usage: node index.js <wallpaper-path|auto|watch|reset|status|help> [dark|light]');
  console.log('');
  console.log('Commands:');
  console.log('  auto dark|light     # Auto-detect wallpaper and apply theme');
  console.log('  watch dark|light    # Watch for wallpaper changes and auto-apply');
  console.log('  reset               # Remove all Lunar Mat customizations');
  console.log('  status              # Show current Lunar Mat status');
  console.log('  help                # Show this help message');
  console.log('');
  console.log('Examples:');
  console.log('  node index.js auto dark                    # Auto-detect wallpaper, dark mode');
  console.log('  node index.js watch light                  # Watch for changes, light mode');
  console.log('  node index.js ~/Pictures/wall.jpg dark     # Manual path, dark mode');
  console.log('  node index.js reset                        # Remove Lunar Mat customizations');
  console.log('  node index.js status                       # Show current status');
  console.log('  node index.js help                         # Show help');
  console.log('');
}

function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  // Handle special commands
  if (command === 'reset') {
    const app = new LunarMat('auto', 'dark'); // dummy values
    app.reset();
    return;
  }

  if (command === 'status') {
    const app = new LunarMat('auto', 'dark'); // dummy values
    app.status();
    return;
  }

  if (command === 'help') {
    printHelp();
    return;
  }

  const wallpaperPath = command;
  const mode = args[1] || 'dark';

  // Validate mode
  if (!['dark', 'light'].includes(mode)) {
    Logger.error('Invalid mode. Use "dark" or "light"');
    process.exit(1);
  }

  // Create and run application
  const app = new LunarMat(wallpaperPath, mode);

  if (app.isWatchMode) {
    app.watch();
  } else {
    app.run();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = LunarMat;