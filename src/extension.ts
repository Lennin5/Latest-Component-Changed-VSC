import * as vscode from 'vscode';
import { watchFile } from 'fs';

// Declare a status bar item
let statusBarItem: vscode.StatusBarItem | undefined;

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
    // Watch .gitconfig for changes
    watchGitConfig();

    // Activate the extension automatically when Visual Studio Code starts up
    vscode.workspace.onDidOpenTextDocument(() => {
        // Trigger the command to create or update the status bar item
        updateStatusBar();
    });
}

export function deactivate() {
    // Dispose of the status bar item when the extension is deactivated
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

// Watch for changes in .gitconfig file
function watchGitConfig() {
    // Path to .gitconfig file
    const gitConfigPath = require('os').homedir() + '/.gitconfig';

    // Watch for changes in .gitconfig file
    watchFile(gitConfigPath, () => {
        // Update the status bar item with the latest value of latest-component-changed
        updateStatusBar();
    });
}

// Return the value of latest-component-changed from .gitconfig if it exists
function getLatestComponentChanged(): string {
    const { execSync } = require('child_process');
    try {
        // Execute git command to get the value of latest-component-changed
        const latestComponentChanged = execSync('git config --get variable.latest-component-changed').toString().trim();
        // If latestComponentChanged is empty, return 'No component changed'
        if (!latestComponentChanged) {
            return 'No component changed';
        } else {
            return latestComponentChanged;
        }
    } catch (error) {
        console.error('Error getting latest component changed:', error);
        // Cuando no existe la variable en el .gitconfig, así:
        // [variable]
        // latest-component-changed = vehiclesTest
        return 'Unknown'; // Return a default value if there's an error
    }
}

// Create or update the status bar item with the latest value of latest-component-changed (terminal-bash icon)
function updateStatusBar() {
    if (!statusBarItem) {
        // If the status bar item doesn't exist, create it
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    }

    statusBarItem.text = `$(code) ${getLatestComponentChanged()}`; // icons list: https://microsoft.github.io/vscode-codicons/dist/codicon.html
    statusBarItem.tooltip = 'Latest component changed';
    statusBarItem.show();
}
