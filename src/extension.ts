import * as vscode from 'vscode';
import { watchFile } from 'fs';

// Declare a status bar item
let statusBarItem: vscode.StatusBarItem | undefined;

// This method is called when the extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Latest Component Changed extension is now active!');

    // Register the command for showing component selector
    const showComponentSelector = vscode.commands.registerCommand('latest-component-changed.showSelector', () => {
        showComponentSelectorQuickPick();
    });
    
    context.subscriptions.push(showComponentSelector);

    // Watch .gitconfig for changes
    watchGitConfig();

    // Initialize the status bar immediately when extension activates
    updateStatusBar();

    // Also update when text documents are opened
    const disposable = vscode.workspace.onDidOpenTextDocument(() => {
        updateStatusBar();
    });
    
    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Latest Component Changed extension is being deactivated');
    // Dispose of the status bar item when the extension is deactivated
    if (statusBarItem) {
        statusBarItem.dispose();
        statusBarItem = undefined;
    }
}

// Watch for changes in .gitconfig file
function watchGitConfig() {
    try {
        // Path to .gitconfig file
        const os = require('os');
        const path = require('path');
        const gitConfigPath = path.join(os.homedir(), '.gitconfig');
        
        console.log(`Watching .gitconfig at: ${gitConfigPath}`);

        // Watch for changes in .gitconfig file
        watchFile(gitConfigPath, (curr, prev) => {
            console.log('.gitconfig file changed, updating status bar');
            // Update the status bar item with the latest value of latest-component-changed
            updateStatusBar();
        });
    } catch (error) {
        console.error('Error setting up .gitconfig watcher:', error);
    }
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

// Get the array of recent components from .gitconfig
function getComponentsArray(): string[] {
    const { execSync } = require('child_process');
    try {
        // Execute git command to get the array of components
        const componentsArray = execSync('git config --get variable.latest-components-array').toString().trim();
        if (!componentsArray) {
            return [];
        }
        // Split the comma-separated string into an array
        return componentsArray.split(',').filter((component: string) => component.trim() !== '');
    } catch (error) {
        console.error('Error getting components array:', error);
        return [];
    }
}

// Set the current component in .gitconfig
function setCurrentComponent(component: string): void {
    const { execSync } = require('child_process');
    try {
        // Execute git command to set the current component
        execSync(`git config --global variable.latest-component-changed "${component}"`);
        // Update the status bar after changing the component
        updateStatusBar();
    } catch (error) {
        console.error('Error setting current component:', error);
        vscode.window.showErrorMessage(`Failed to set component: ${error}`);
    }
}

// Show the component selector quick pick
function showComponentSelectorQuickPick(): void {
    const components = getComponentsArray();
    
    if (components.length === 0) {
        vscode.window.showInformationMessage('No recent components found');
        return;
    }

    const currentComponent = getLatestComponentChanged();
    
    // Create quick pick items
    const quickPickItems: vscode.QuickPickItem[] = components.map(component => ({
        label: component,
        description: component === currentComponent ? '(current)' : '',
        picked: component === currentComponent
    }));

    // Show the quick pick
    vscode.window.showQuickPick(quickPickItems, {
        placeHolder: 'Select a component to set as current',
        title: 'Recent Components'
    }).then(selected => {
        if (selected) {
            setCurrentComponent(selected.label);
            vscode.window.showInformationMessage(`Component changed to: ${selected.label}`);
        }
    });
}

// Create or update the status bar item with the latest value of latest-component-changed (terminal-bash icon)
function updateStatusBar() {
    try {
        if (!statusBarItem) {
            // If the status bar item doesn't exist, create it
            statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        }

        const currentComponent = getLatestComponentChanged();
        const componentsArray = getComponentsArray();
        
        console.log(`Updating status bar with component: ${currentComponent}`);
        console.log(`Components array: ${componentsArray.join(', ')}`);
        
        // statusBarItem.text = `$(code) ${currentComponent}`;
        statusBarItem.text = `$(git-branch) ${currentComponent}`;
        
        // Make the status bar item clickable
        statusBarItem.command = 'latest-component-changed.showSelector';
        
        // Update tooltip to show it's clickable and show recent components
        if (componentsArray.length > 1) {
            statusBarItem.tooltip = `Latest component changed: ${currentComponent}\n\nClick to select from recent components:\n${componentsArray.join(', ')}`;
        } else {
            statusBarItem.tooltip = `Latest component changed: ${currentComponent}\n\nClick to select component`;
        }
        
        statusBarItem.show();
    } catch (error) {
        console.error('Error updating status bar:', error);
    }
}
