# VS Code Theme Customization Reference

This document explains each VS Code workbench color customization token used in the ThemeGenerator.

## Editor Background and Surfaces

- **`editor.background`**: The main background color of the editor pane where code is displayed
- **`editor.lineHighlightBackground`**: Background color of the currently active line in the editor
- **`editorGutter.background`**: Background color of the gutter area (left side containing line numbers, breakpoints, etc.)
- **`editorGroupHeader.tabsBackground`**: Background color of the tab header area in editor groups
- **`editorGroupHeader.tabsBorder`**: Border color separating the tab header from the editor content

## Activity Bar

- **`activityBar.foreground`**: Text/icon color for activity bar items (Explorer, Search, etc.)
- **`activityBarBadge.background`**: Background color for notification badges on activity bar icons
- **`activityBar.activeBorder`**: Border color for the currently active activity bar item
- **`activityBar.background`**: Background color of the entire activity bar

## Status Bar

- **`statusBar.background`**: Background color of the status bar at the bottom
- **`statusBar.foreground`**: Text color for status bar items
- **`statusBarItem.prominentBackground`**: Background for prominent/important status bar items
- **`statusBar.border`**: Border color at the top of the status bar

## Editor Cursors and Line Numbers

- **`editorCursor.foreground`**: Color of the text cursor (caret) in the editor
- **`editorLineNumber.activeForeground`**: Color of the line number for the currently active line

## Selections and Highlights

- **`editor.selectionBackground`**: Background color for selected text
- **`editor.inactiveSelectionBackground`**: Background color for selections when editor is not focused
- **`editor.selectionHighlightBackground`**: Background color for other occurrences of selected text
- **`editor.wordHighlightBackground`**: Background color for highlighted words under cursor
- **`editor.wordHighlightStrongBackground`**: Background color for strongly highlighted words
- **`editor.findMatchBackground`**: Background color for find/search matches
- **`editor.findMatchHighlightBackground`**: Background color for other find matches
- **`editor.rangeHighlightBackground`**: Background color for highlighted ranges

## Sidebar

- **`sideBarTitle.foreground`**: Text color for sidebar section titles
- **`sideBarSectionHeader.foreground`**: Text color for sidebar section headers
- **`sideBar.background`**: Background color of the sidebar
- **`sideBar.border`**: Border color between sidebar and editor
- **`sideBarSectionHeader.background`**: Background color for sidebar section headers

## Tabs

- **`tab.activeForeground`**: Text color for the active tab
- **`tab.activeBorder`**: Border color at the bottom of the active tab
- **`tab.activeBackground`**: Background color of the active tab
- **`tab.inactiveBackground`**: Background color of inactive tabs
- **`tab.hoverBackground`**: Background color when hovering over a tab
- **`tab.border`**: Border color between tabs
- **`editorGroupHeader.border`**: Border color below the tab bar

## Panel

- **`panelTitle.activeBorder`**: Border color for the active panel title
- **`panelTitle.activeForeground`**: Text color for the active panel title
- **`panel.background`**: Background color of panels (Terminal, Output, etc.)
- **`panel.border`**: Border color at the top of panels
- **`panelSection.border`**: Border color between panel sections

## Buttons

- **`button.background`**: Background color for primary buttons
- **`button.hoverBackground`**: Background color when hovering over buttons
- **`button.secondaryBackground`**: Background color for secondary buttons
- **`button.border`**: Border color for buttons

## Input Fields

- **`input.background`**: Background color for input fields (search, settings, etc.)
- **`input.border`**: Border color for input fields
- **`inputOption.activeBorder`**: Border color for active input options
- **`inputOption.activeBackground`**: Background color for active input options
- **`inputOption.activeForeground`**: Text color for active input options
- **`focusBorder`**: Border color for focused elements

## Dropdown Menus

- **`dropdown.background`**: Background color for dropdown menus
- **`dropdown.listBackground`**: Background color for dropdown list items
- **`dropdown.border`**: Border color for dropdown menus
- **`dropdown.foreground`**: Text color for dropdown menu items

## Quick Picker (Command Palette)

- **`quickInput.background`**: Background color of the command palette/quick input
- **`quickInput.foreground`**: Text color in the command palette
- **`quickInputList.focusBackground`**: Background color for focused items in quick input lists
- **`quickInputList.focusForeground`**: Text color for focused items in quick input lists
- **`quickInputTitle.background`**: Background color of the quick input title bar

## Lists

- **`list.activeSelectionBackground`**: Background color for actively selected list items
- **`list.inactiveSelectionBackground`**: Background color for selected items when not focused
- **`list.hoverBackground`**: Background color when hovering over list items
- **`list.focusBackground`**: Background color for focused list items
- **`list.highlightForeground`**: Text color for highlighted items in lists
- **`list.focusOutline`**: Outline color for focused list items
- **`list.inactiveFocusOutline`**: Outline color for unfocused but selected items

## Menu

- **`menu.background`**: Background color for context menus
- **`menu.foreground`**: Text color for menu items
- **`menu.selectionBackground`**: Background color for selected menu items
- **`menu.selectionForeground`**: Text color for selected menu items
- **`menu.border`**: Border color for menus
- **`menubar.selectionBackground`**: Background color for selected menubar items
- **`menubar.selectionForeground`**: Text color for selected menubar items

## Scrollbar

- **`scrollbarSlider.background`**: Background color of the scrollbar slider
- **`scrollbarSlider.hoverBackground`**: Background color when hovering over scrollbar
- **`scrollbarSlider.activeBackground`**: Background color when dragging scrollbar

## Badge

- **`badge.background`**: Background color for badges (like extension counts)
- **`badge.foreground`**: Text color for badge content

## Progress Bar

- **`progressBar.background`**: Background color for progress bars

## Links

- **`textLink.foreground`**: Color for text links
- **`textLink.activeForeground`**: Color for active/clicked links

## Breadcrumbs

- **`breadcrumb.activeSelectionForeground`**: Text color for active breadcrumb items
- **`breadcrumb.background`**: Background color for breadcrumb navigation
- **`breadcrumb.focusForeground`**: Text color for focused breadcrumb items
- **`breadcrumbPicker.background`**: Background color for breadcrumb picker dropdown

## Git Decorations

- **`gitDecoration.modifiedResourceForeground`**: Color for modified file indicators
- **`gitDecoration.untrackedResourceForeground`**: Color for untracked file indicators
- **`gitDecoration.addedResourceForeground`**: Color for added file indicators
- **`gitDecoration.deletedResourceForeground`**: Color for deleted file indicators

## Terminal

- **`terminal.background`**: Background color of the integrated terminal
- **`terminal.ansiBlue`**: ANSI blue color for terminal output
- **`terminal.ansiCyan`**: ANSI cyan color for terminal output
- **`terminal.ansiMagenta`**: ANSI magenta color for terminal output
- **`terminal.ansiBrightBlue`**: Bright ANSI blue color for terminal output
- **`terminal.ansiBrightCyan`**: Bright ANSI cyan color for terminal output

## Peek View

- **`peekViewEditor.background`**: Background color of the peek editor
- **`peekViewResult.background`**: Background color of peek results
- **`peekViewTitle.background`**: Background color of peek view title
- **`peekView.border`**: Border color for peek views

## Minimap

- **`minimap.selectionHighlight`**: Highlight color for selections in minimap
- **`minimap.findMatchHighlight`**: Highlight color for find matches in minimap
- **`minimapGutter.addedBackground`**: Background color for added lines in minimap gutter
- **`minimapGutter.modifiedBackground`**: Background color for modified lines in minimap gutter

## Editor Widgets

- **`editorWidget.background`**: Background color for editor widgets (hover, suggest, etc.)
- **`editorWidget.border`**: Border color for editor widgets
- **`editorWidget.foreground`**: Text color for editor widget content
- **`editorSuggestWidget.background`**: Background color for suggestion widget
- **`editorSuggestWidget.border`**: Border color for suggestion widget
- **`editorSuggestWidget.selectedBackground`**: Background color for selected suggestions
- **`editorSuggestWidget.highlightForeground`**: Highlight color for matching text in suggestions
- **`editorSuggestWidget.focusHighlightForeground`**: Highlight color for focused matching text
- **`editorHoverWidget.background`**: Background color for hover widgets
- **`editorHoverWidget.border`**: Border color for hover widgets

## Notifications

- **`notificationCenter.border`**: Border color for notification center
- **`notificationCenterHeader.background`**: Background color for notification center header
- **`notifications.background`**: Background color for notifications
- **`notifications.border`**: Border color for notification borders
- **`notificationLink.foreground`**: Color for links in notifications

## Title Bar

- **`titleBar.activeBackground`**: Background color for active window title bar
- **`titleBar.inactiveBackground`**: Background color for inactive window title bar
- **`titleBar.border`**: Border color for title bar

## Settings Editor

- **`settings.headerForeground`**: Text color for settings headers
- **`settings.modifiedItemIndicator`**: Color for modified setting indicators
- **`settings.dropdownBackground`**: Background color for settings dropdowns
- **`settings.dropdownBorder`**: Border color for settings dropdowns
- **`settings.textInputBackground`**: Background color for text inputs in settings
- **`settings.textInputBorder`**: Border color for text inputs in settings
- **`settings.numberInputBackground`**: Background color for number inputs in settings
- **`settings.numberInputBorder`**: Border color for number inputs in settings
- **`settings.checkboxBackground`**: Background color for checkboxes in settings
- **`settings.checkboxBorder`**: Border color for checkboxes in settings

## Diff Editor

- **`diffEditor.insertedTextBackground`**: Background color for inserted text in diff view
- **`diffEditor.removedTextBackground`**: Background color for removed text in diff view

## Extension Buttons

- **`extensionButton.prominentBackground`**: Background color for prominent extension buttons
- **`extensionButton.prominentHoverBackground`**: Background color when hovering over prominent extension buttons