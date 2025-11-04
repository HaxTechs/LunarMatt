const ColorUtils = require('../utils/ColorUtils');
const { CATPPUCCIN_THEMES } = require('../config/constants');

/**
 * Theme generator for VS Code
 * Creates Catppuccin-based color overrides from extracted palette
 */
class ThemeGenerator {
  constructor(palette, mode = 'dark') {
    this.palette = palette;
    this.mode = mode;
  }

  /**
   * Generate accent colors from palette
   * @returns {Object} Accent color variations
   */
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

  /**
   * Generate surface colors from palette
   * @returns {Object} Surface color variations
   */
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

  /**
   * Get text colors based on mode
   * @returns {string} Text color
   */
  getTextColor() {
    return this.mode === 'dark' ? '#cdd6f4' : '#4c4f69';
  }

  /**
   * Create VS Code color customizations
   * @returns {Object} Complete VS Code color overrides
   */
  generate() {
    const accents = this.generateAccentColors();
    const surfaces = this.generateSurfaceColors();
    const textColor = this.getTextColor();

    return {
      'workbench.colorTheme': CATPPUCCIN_THEMES[this.mode],
      
      'workbench.colorCustomizations': {
        // Editor background and surfaces
        'editor.background': surfaces.surfaceDim,
        'editor.lineHighlightBackground': surfaces.surface,
        'editorGutter.background': surfaces.surfaceDim,
        'editorGroupHeader.tabsBackground': surfaces.surfaceDim,
        'editorGroupHeader.tabsBorder': surfaces.surface,
        
        // Activity Bar
        'activityBar.foreground': accents.primary,
        'activityBarBadge.background': accents.primary,
        'activityBar.activeBorder': accents.primary,
        'activityBar.background': surfaces.surfaceDim,
        
        // Status Bar
        'statusBar.background': surfaces.surfaceDim,
        'statusBar.foreground': accents.primary,
        'statusBarItem.prominentBackground': surfaces.surface,
        'statusBar.border': surfaces.surface,
        
        // Editor cursors and line numbers
        'editorCursor.foreground': accents.primaryBright,
        'editorLineNumber.activeForeground': accents.primaryBright,
        
        // Selections and highlights
        'editor.selectionBackground': ColorUtils.withOpacity(accents.primaryDim, 0.3),
        'editor.inactiveSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.15),
        'editor.selectionHighlightBackground': ColorUtils.withOpacity(accents.secondary, 0.2),
        'editor.wordHighlightBackground': ColorUtils.withOpacity(accents.secondary, 0.2),
        'editor.wordHighlightStrongBackground': ColorUtils.withOpacity(accents.primary, 0.25),
        'editor.findMatchBackground': ColorUtils.withOpacity(accents.accent, 0.4),
        'editor.findMatchHighlightBackground': ColorUtils.withOpacity(accents.accent, 0.2),
        'editor.rangeHighlightBackground': ColorUtils.withOpacity(accents.primary, 0.1),
        
        // Sidebar
        'sideBarTitle.foreground': accents.primary,
        'sideBarSectionHeader.foreground': accents.primary,
        'sideBar.background': surfaces.surfaceDim,
        'sideBar.border': surfaces.surface,
        'sideBarSectionHeader.background': surfaces.surface,
        
        // Tabs
        'tab.activeForeground': accents.primary,
        'tab.activeBorder': accents.primary,
        'tab.activeBackground': surfaces.surface,
        'tab.inactiveBackground': surfaces.surfaceDim,
        'tab.hoverBackground': surfaces.surfaceLight,
        'tab.border': surfaces.surface,
        'editorGroupHeader.border': surfaces.surface,
        
        // Panel
        'panelTitle.activeBorder': accents.primary,
        'panelTitle.activeForeground': accents.primary,
        'panel.background': surfaces.surface,
        'panel.border': surfaces.surface,
        'panelSection.border': surfaces.surface,
        
        // Buttons
        'button.background': accents.primary,
        'button.hoverBackground': accents.primaryBright,
        'button.secondaryBackground': surfaces.surface,
        'button.border': surfaces.surfaceLight,
        
        // Input fields
        'input.background': surfaces.surface,
        'input.border': surfaces.surfaceLight,
        'inputOption.activeBorder': accents.primary,
        'inputOption.activeBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        'inputOption.activeForeground': accents.primary,
        'focusBorder': accents.primary,
        
        // Dropdown menus
        'dropdown.background': surfaces.surface,
        'dropdown.listBackground': surfaces.surface,
        'dropdown.border': surfaces.surfaceLight,
        'dropdown.foreground': textColor,
        
        // Quick picker (Command Palette)
        'quickInput.background': surfaces.surface,
        'quickInput.foreground': textColor,
        'quickInputList.focusBackground': ColorUtils.withOpacity(accents.primaryBright, 0.2),
        'quickInputList.focusForeground': textColor,
        'quickInputTitle.background': surfaces.surfaceDim,
        
        // Lists
        'list.activeSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.3),
        'list.inactiveSelectionBackground': ColorUtils.withOpacity(accents.primary, 0.15),
        'list.hoverBackground': surfaces.surfaceLight,
        'list.focusBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        'list.highlightForeground': accents.primary,
        'list.focusOutline': accents.primary,
        'list.inactiveFocusOutline': accents.primaryDim,
        
        // Menu
        'menu.background': surfaces.surface,
        'menu.foreground': textColor,
        'menu.selectionBackground': ColorUtils.withOpacity(accents.primaryBright, 0.2),
        'menu.selectionForeground': accents.primary,
        'menu.border': surfaces.surfaceLight,
        'menubar.selectionBackground': ColorUtils.withOpacity(accents.primaryBright, 0.2),
        'menubar.selectionForeground': accents.primary,
        
        // Scrollbar
        'scrollbarSlider.background': ColorUtils.withOpacity(surfaces.surface, 0.5),
        'scrollbarSlider.hoverBackground': ColorUtils.withOpacity(surfaces.surface, 0.7),
        'scrollbarSlider.activeBackground': ColorUtils.withOpacity(accents.primary, 0.5),
        
        // Badge
        'badge.background': accents.primary,
        'badge.foreground': surfaces.surfaceDim,
        
        // Progress Bar
        'progressBar.background': accents.primary,
        
        // Links
        'textLink.foreground': accents.primary,
        'textLink.activeForeground': accents.primaryBright,
        
        // Breadcrumbs
        'breadcrumb.activeSelectionForeground': accents.primary,
        'breadcrumb.background': surfaces.surface,
        'breadcrumb.focusForeground': accents.primary,
        'breadcrumbPicker.background': surfaces.surface,
        
        // Git decorations
        'gitDecoration.modifiedResourceForeground': accents.secondary,
        'gitDecoration.untrackedResourceForeground': accents.accent,
        'gitDecoration.addedResourceForeground': accents.secondary,
        'gitDecoration.deletedResourceForeground': accents.accentDim,
        
        // Terminal
        'terminal.background': surfaces.surface,
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
        'minimapGutter.addedBackground': accents.secondary,
        'minimapGutter.modifiedBackground': accents.secondary,
        
        // Editor widgets
        'editorWidget.background': surfaces.surface,
        'editorWidget.border': surfaces.surfaceLight,
        'editorWidget.foreground': textColor,
        'editorSuggestWidget.background': surfaces.surface,
        'editorSuggestWidget.border': surfaces.surfaceLight,
        'editorSuggestWidget.selectedBackground': ColorUtils.withOpacity(accents.primary, 0.2),
        'editorSuggestWidget.highlightForeground': accents.primary,
        'editorSuggestWidget.focusHighlightForeground': accents.primaryBright,
        'editorHoverWidget.background': surfaces.surface,
        'editorHoverWidget.border': surfaces.surfaceLight,
        
        // Notifications
        'notificationCenter.border': surfaces.surface,
        'notificationCenterHeader.background': surfaces.surfaceDim,
        'notifications.background': surfaces.surface,
        'notifications.border': surfaces.surfaceLight,
        'notificationLink.foreground': accents.primary,
        
        // Title bar
        'titleBar.activeBackground': surfaces.surfaceDim,
        'titleBar.inactiveBackground': surfaces.surfaceDim,
        'titleBar.border': surfaces.surface,
        
        // Settings editor
        'settings.headerForeground': accents.primary,
        'settings.modifiedItemIndicator': accents.primary,
        'settings.dropdownBackground': surfaces.surface,
        'settings.dropdownBorder': surfaces.surfaceLight,
        'settings.textInputBackground': surfaces.surface,
        'settings.textInputBorder': surfaces.surfaceLight,
        'settings.numberInputBackground': surfaces.surface,
        'settings.numberInputBorder': surfaces.surfaceLight,
        'settings.checkboxBackground': surfaces.surface,
        'settings.checkboxBorder': surfaces.surfaceLight,
        
        // Diff editor
        'diffEditor.insertedTextBackground': ColorUtils.withOpacity(accents.secondary, 0.2),
        'diffEditor.removedTextBackground': ColorUtils.withOpacity(accents.accent, 0.2),
        
        // Extension buttons
        'extensionButton.prominentBackground': accents.primary,
        'extensionButton.prominentHoverBackground': accents.primaryBright,
      },
    };
  }
}

module.exports = ThemeGenerator;