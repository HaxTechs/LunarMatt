#!/usr/bin/env node

/**
 * Adaptive Wallpaper Color Extractor for VS Code
 * Extracts colors from wallpaper and applies accent/surface overrides
 * to Catppuccin base theme
 * 
 * PREREQUISITE: Catppuccin theme must be installed and active in VS Code
 */

const { Vibrant } = require('node-vibrant/node');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuration
const CONFIG = {
  wallpaperPath: process.argv[2] || path.join(__dirname, 'wallpaper.jpg'),
  mode: process.argv[3] || 'dark', // 'dark' or 'light'
  vscodeSettingsPath: path.join(
    os.homedir(),
    process.platform === 'win32'
      ? 'AppData/Roaming/Code/User/settings.json'
      : process.platform === 'darwin'
      ? 'Library/Application Support/Code/User/settings.json'
      : '.config/Code/User/settings.json'
  ),
};

/**
 * Color manipulation utilities
 */
class ColorUtils {
  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  static adjustBrightness(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (value) => {
      const adjusted = Math.round(value * (1 + percent / 100));
      return Math.max(0, Math.min(255, adjusted));
    };

    return this.rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
  }

  static adjustSaturation(hex, percent) {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const { r, g, b } = rgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return hex;

    const saturation = delta / max;
    const newSaturation = Math.max(0, Math.min(1, saturation * (1 + percent / 100)));

    const adjust = (value) => {
      const gray = max - delta * saturation;
      return Math.round(gray + (value - gray) * (newSaturation / saturation));
    };

    return this.rgbToHex(adjust(r), adjust(g), adjust(b));
  }

  static withOpacity(hex, opacity) {
    return `${hex}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }

  static blend(color1, color2, ratio = 0.5) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return this.rgbToHex(r, g, b);
  }
}

/**
 * Theme generator - creates minimal overrides for Catppuccin base
 */
class ThemeGenerator {
  constructor(palette, mode) {
    this.palette = palette;
    this.mode = mode;
  }

  generateAccentColors() {
    const primary = this.palette.Vibrant?.hex || '#89b4fa';
    const secondary = this.palette.LightVibrant?.hex || '#a6e3a1';
    const accent = this.palette.DarkVibrant?.hex || '#f38ba8';

    if (this.mode === 'dark') {
      return {
        primary: ColorUtils.adjustSaturation(primary, 15),
        primaryDim: ColorUtils.adjustBrightness(primary, -25),
        primaryBright: ColorUtils.adjustBrightness(primary, 15),
        secondary: ColorUtils.adjustSaturation(secondary, 10),
        secondaryDim: ColorUtils.adjustBrightness(secondary, -30),
        accent: ColorUtils.adjustSaturation(accent, 10),
        accentDim: ColorUtils.adjustBrightness(accent, -20),
      };
    } else {
      // Light mode
      return {
        primary: ColorUtils.adjustSaturation(primary, 10),
        primaryDim: ColorUtils.adjustBrightness(primary, 25),
        primaryBright: ColorUtils.adjustBrightness(primary, -15),
        secondary: ColorUtils.adjustSaturation(secondary, 5),
        secondaryDim: ColorUtils.adjustBrightness(secondary, 20),
        accent: ColorUtils.adjustSaturation(accent, 15),
        accentDim: ColorUtils.adjustBrightness(accent, 30),
      };
    }
  }

  generateSurfaceColors() {
    const muted = this.palette.Muted?.hex || '#6c7086';
    
    if (this.mode === 'dark') {
      return {
        surface: ColorUtils.adjustBrightness(muted, -60),
        surfaceLight: ColorUtils.adjustBrightness(muted, -50),
        surfaceDim: ColorUtils.adjustBrightness(muted, -70),
      };
    } else {
      return {
        surface: ColorUtils.adjustBrightness(muted, 60),
        surfaceLight: ColorUtils.adjustBrightness(muted, 70),
        surfaceDim: ColorUtils.adjustBrightness(muted, 50),
      };
    }
  }

  createVSCodeOverrides() {
    const accents = this.generateAccentColors();
    const surfaces = this.generateSurfaceColors();

    return {
      'workbench.colorTheme': this.mode === 'dark' 
        ? 'Catppuccin Mocha' 
        : 'Catppuccin Latte',
      
      'workbench.colorCustomizations': {
        // Accent color overrides - Primary UI elements
        'activityBar.foreground': accents.primary,
        'activityBarBadge.background': accents.primary,
        'activityBar.activeBorder': accents.primary,
        
        'statusBar.background': surfaces.surfaceDim,
        'statusBar.foreground': accents.primary,
        'statusBarItem.prominentBackground': surfaces.surface,
        
        'editorCursor.foreground': accents.primary,
        'editorLineNumber.activeForeground': accents.primary,
        
        // Selection and highlights
        'editor.selectionBackground': ColorUtils.withOpacity(accents.primary, 0.3),
        'editor.inactiveSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.15),
        'editor.selectionHighlightBackground': ColorUtils.withOpacity(accents.secondary, 0.2),
        'editor.wordHighlightBackground': ColorUtils.withOpacity(accents.secondary, 0.2),
        'editor.wordHighlightStrongBackground': ColorUtils.withOpacity(accents.primary, 0.25),
        'editor.findMatchBackground': ColorUtils.withOpacity(accents.accent, 0.4),
        'editor.findMatchHighlightBackground': ColorUtils.withOpacity(accents.accent, 0.2),
        
        // Sidebar accents
        'sideBarTitle.foreground': accents.primary,
        'sideBarSectionHeader.foreground': accents.primary,
        'sideBar.background': surfaces.surfaceDim,
        
        // Tab accents
        'tab.activeForeground': accents.primary,
        'tab.activeBorder': accents.primary,
        'tab.activeBackground': surfaces.surface,
        'tab.inactiveBackground': surfaces.surfaceDim,
        'tab.hoverBackground': surfaces.surfaceLight,
        
        // Panel
        'panelTitle.activeBorder': accents.primary,
        'panelTitle.activeForeground': accents.primary,
        'panel.background': surfaces.surface,
        
        // Buttons
        'button.background': accents.primary,
        'button.hoverBackground': accents.primaryBright,
        'button.secondaryBackground': surfaces.surface,
        
        // Input
        'input.background': surfaces.surface,
        'inputOption.activeBorder': accents.primary,
        'inputOption.activeBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        
        // Lists
        'list.activeSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.3),
        'list.inactiveSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.15),
        'list.hoverBackground': surfaces.surfaceLight,
        'list.focusBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        'list.highlightForeground': accents.primary,
        
        // Scrollbar
        'scrollbarSlider.background': ColorUtils.withOpacity(surfaces.surface, 0.5),
        'scrollbarSlider.hoverBackground': ColorUtils.withOpacity(surfaces.surface, 0.7),
        'scrollbarSlider.activeBackground': ColorUtils.withOpacity(accents.primary, 0.5),
        
        // Badge
        'badge.background': accents.primary,
        
        // Progress Bar
        'progressBar.background': accents.primary,
        
        // Links
        'textLink.foreground': accents.primary,
        'textLink.activeForeground': accents.primaryBright,
        
        // Breadcrumbs
        'breadcrumb.activeSelectionForeground': accents.primary,
        
        // Git decorations with extracted colors
        'gitDecoration.modifiedResourceForeground': accents.secondary,
        'gitDecoration.untrackedResourceForeground': accents.accent,
        'gitDecoration.addedResourceForeground': accents.secondary,
        
        // Terminal accents (minimal overrides)
        'terminal.ansiBlue': accents.primary,
        'terminal.ansiCyan': accents.secondary,
        'terminal.ansiMagenta': accents.primaryBright,
        'terminal.ansiBrightBlue': accents.primaryBright,
        'terminal.ansiBrightCyan': accents.secondary,
        
        // Peek view
        'peekViewEditor.background': surfaces.surface,
        'peekViewResult.background': surfaces.surfaceDim,
        'peekViewTitle.background': surfaces.surfaceDim,
        'peekView.border': accents.primary,
        
        // Minimap
        'minimap.selectionHighlight': accents.primary,
        'minimap.findMatchHighlight': accents.accent,
        
        // Editor widget
        'editorWidget.background': surfaces.surface,
        'editorWidget.border': surfaces.surfaceLight,
        'editorSuggestWidget.selectedBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        'editorSuggestWidget.highlightForeground': accents.primary,
        
        // Notifications
        'notificationLink.foreground': accents.primary,
        
        // Title bar (subtle surface)
        'titleBar.activeBackground': surfaces.surfaceDim,
        'titleBar.inactiveBackground': surfaces.surfaceDim,
      },
    };
  }
}

/**
 * Main application logic
 */
class AdaptiveWallpaperTheme {
  constructor(config) {
    this.config = config;
  }

  async extractColors() {
    console.log('🎨 Extracting colors from wallpaper...');
    console.log(`📁 Wallpaper: ${this.config.wallpaperPath}`);
    
    try {
      const vibrant = new Vibrant(this.config.wallpaperPath);
      const palette = await vibrant.getPalette();
      
      console.log('\n✨ Extracted Color Palette:');
      Object.keys(palette).forEach(key => {
        if (palette[key]) {
          console.log(`   ${key.padEnd(15)}: ${palette[key].hex}`);
        }
      });
      
      return palette;
    } catch (error) {
      throw new Error(`Failed to extract colors: ${error.message}`);
    }
  }

  readVSCodeSettings() {
    try {
      if (fs.existsSync(this.config.vscodeSettingsPath)) {
        const content = fs.readFileSync(this.config.vscodeSettingsPath, 'utf8');
        return JSON.parse(content);
      }
      return {};
    } catch (error) {
      console.warn('⚠️  Could not read existing settings, creating new file');
      return {};
    }
  }

  writeVSCodeSettings(settings) {
    try {
      const dir = path.dirname(this.config.vscodeSettingsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(
        this.config.vscodeSettingsPath,
        JSON.stringify(settings, null, 2),
        'utf8'
      );
      console.log(`\n✅ Settings applied successfully!`);
      console.log(`📝 Location: ${this.config.vscodeSettingsPath}`);
    } catch (error) {
      throw new Error(`Failed to write settings: ${error.message}`);
    }
  }

  checkCatppuccinTheme(settings) {
    const currentTheme = settings['workbench.colorTheme'] || '';
    const isCatppuccin = currentTheme.toLowerCase().includes('catppuccin');
    
    if (!isCatppuccin) {
      console.warn('\n⚠️  WARNING: Catppuccin theme not detected!');
      console.warn('   This script works best with Catppuccin as the base theme.');
      console.warn('   Install Catppuccin from: https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc');
      console.warn('\n   The script will still apply color overrides, but results may vary.\n');
    }
    
    return isCatppuccin;
  }

  async apply() {
    try {
      console.log('🚀 Adaptive Wallpaper Theme Generator for Catppuccin');
      console.log(`🌓 Mode: ${this.config.mode}\n`);

      // Extract colors
      const palette = await this.extractColors();

      // Generate theme overrides
      const generator = new ThemeGenerator(palette, this.config.mode);
      const overrides = generator.createVSCodeOverrides();

      // Read existing settings
      const existingSettings = this.readVSCodeSettings();
      
      // Check for Catppuccin
      this.checkCatppuccinTheme(existingSettings);

      // Merge color customizations
      const mergedColorCustomizations = {
        ...(existingSettings['workbench.colorCustomizations'] || {}),
        ...overrides['workbench.colorCustomizations'],
      };

      // Create final settings
      const finalSettings = {
        ...existingSettings,
        'workbench.colorTheme': overrides['workbench.colorTheme'],
        'workbench.colorCustomizations': mergedColorCustomizations,
      };

      // Write settings
      this.writeVSCodeSettings(finalSettings);

      console.log('\n🎉 Accent and surface colors applied!');
      console.log(`🎨 Base theme: ${overrides['workbench.colorTheme']}`);
      console.log('\n💡 Tips:');
      console.log('   - Restart VS Code to see changes');
      console.log('   - Make sure Catppuccin theme is installed');
      console.log('   - Try different wallpapers for different vibes');
      console.log('\n🔄 Switch modes:');
      console.log(`   node index.js ${this.config.wallpaperPath} ${this.config.mode === 'dark' ? 'light' : 'dark'}`);

      return true;
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      if (error.message.includes('ENOENT')) {
        console.error('\n💡 Make sure the wallpaper path is correct!');
        console.error(`   Tried to load: ${this.config.wallpaperPath}`);
      }
      process.exit(1);
    }
  }
}

// Run the application
if (require.main === module) {
  const app = new AdaptiveWallpaperTheme(CONFIG);
  app.apply();
}

module.exports = { AdaptiveWallpaperTheme, ThemeGenerator, ColorUtils };