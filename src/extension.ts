import * as vscode from 'vscode';
import { watchFile } from 'fs';

let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

    // Watch .gitconfig for changes
    watchGitConfig();

    let disposable = vscode.commands.registerCommand('latest-component-changed-vsc.CustomExtension', () => {		
        // Create a status bar item
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        // statusBarItem.text = '[latest component changed]: ' + getLatestComponentChanged();
        statusBarItem.text = `$(code) ${getLatestComponentChanged()}`;
        statusBarItem.tooltip = 'Latest component changed';
        statusBarItem.show();		
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

function watchGitConfig() {
    // Path to .gitconfig file
    const gitConfigPath = require('os').homedir() + '/.gitconfig';

    // Watch for changes in .gitconfig file
    watchFile(gitConfigPath, () => {
        // Update the status bar item with the latest value of latest-component-changed
        updateStatusBar();
    });
}

function getLatestComponentChanged(): string {
    const { execSync } = require('child_process');
    try {
        // Execute git command to get the value of latest-component-changed
        const latestComponentChanged = execSync('git config --get variable.latest-component-changed').toString().trim();
        return latestComponentChanged;
    } catch (error) {
        console.error('Error getting latest component changed:', error);
        return 'Unknown'; // Return a default value if there's an error
    }
}

function updateStatusBar() {
    // Update the status bar item with the latest value of latest-component-changed
    // statusBarItem.text = '[latest component changed]: ' + getLatestComponentChanged();
	statusBarItem.text = `$(code) ${getLatestComponentChanged()}`;
	statusBarItem.tooltip = 'Latest component changed';
    statusBarItem.show();
}
