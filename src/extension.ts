import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	let statusBarItem: vscode.StatusBarItem;

	// Create and show a status bar item
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	// statusBarItem.text = "Hola Mundo";
	statusBarItem.text = getLatestComponentChanged();
	statusBarItem.show();

	let disposable = vscode.commands.registerCommand('latest-component-changed-vsc.CustomExtension', () => {
		vscode.window.showInformationMessage('Hello World from tessssst!');
		console.log('The latest component changed is:', getLatestComponentChanged());
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

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
