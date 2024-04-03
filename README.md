# Latest Component Changed VSC

The Latest Component Changed VSC extension for Visual Studio Code displays the latest changed component in the development environment based on the configuration in the .gitconfig file.

## Features

- Displays the latest changed component in the Visual Studio Code status bar.
- Automatically updates when changes occur in the .gitconfig file.


## Usage

1. Install the extension from the Visual Studio Code Marketplace.
2. Run the "Run My Extension" command from the command palette (Ctrl+Shift+P or Cmd+Shift+P on macOS).
3. The latest changed component will be displayed in the Visual Studio Code status bar.

## Configuration

No additional configuration is required. The extension automatically retrieves information from the .gitconfig file.

## Build

To create .vsix extension file, you need to execute command: vsce package
- If you don't have vsce library, install it with command: npm install -g vsce

## Icons

The extension utilizes icons from VS Code Codicons for the status bar.

## Notes

- Ensure that the `variable.latest-component-changed` variable is properly configured in your .gitconfig file for accurate results.
- The extension is designed to provide information about the latest changed component based on the development environment configuration.
