# Latest Component Changed VSC

The Latest Component Changed VSC extension for Visual Studio Code displays the latest changed component in the development environment based on the configuration in the .gitconfig file.

## Features

- Displays the latest changed component in the Visual Studio Code status bar.
- Automatically updates when changes occur in the .gitconfig file.

1. Install the extension from the Visual Studio Code Marketplace.
2. The latest changed component will be displayed in the Visual Studio Code status bar automatically.
3. Compatibility and personal use with conventional commit environment

## Configuration

No additional configuration is required. The extension automatically retrieves information from the .gitconfig file.

## Before Build
You need node_modules before create the .vsix file, if you clone this repo, don't remember the command: $ npm install

## Build

To create .vsix extension file, you need to execute command: $ vsce package
- If you don't have vsce library, install it with command: $ npm install -g vsce

## Possible Compilation Errors
When we type vsce package to create .vsix file and we already have the vsce package, and shows a message like:

"vsce : No se puede cargar el archivo C:\Program Files\nodejs\vsce.ps1 porque la ejecución de scripts está deshabilitada en este sistema.

Para obtener más información,
consulta el tema about_Execution_Policies en https:/go.microsoft.com/fwlink/?LinkID=135170.
En línea: 1 Carácter: 1
vsce package
    CategoryInfo          : SecurityError: ,
    PSSecurityException
    FullyQualifiedErrorId : UnauthorizedAccess"

We need security access on our system, in Windows Systems the solution is:

- Open the Windows Powershell as EXECUTE AS ADMINISTRATOR
- Type commad: $ Get-ExecutionPolicy
- Then command: $ Set-ExecutionPolicy RemoteSigned
- Type "Yes" and Enter

Now we can generate the .vsix file to install the extension in Visual Studio Code

## Icons

The extension utilizes icons from VS Code Codicons for the status bar.
- The list of compatible icons: https://microsoft.github.io/vscode-codicons/dist/codicon.html

## Notes

- Ensure that the `variable.latest-component-changed` variable is properly configured in your .gitconfig file for accurate results.
- The extension is designed to provide information about the latest changed component based on the development environment configuration.

- The .gitconfig-example is the structure of file that contains all command alias to use and read by extension, this will be located in : 
```
C:\Users\Lenni\.gitconfig 
```
- The post-commit-example is the sctructure of file that contains all shell script commands to read by extensio, this will be located in:
```
C:\Program Files\Git\hooks\post-commit
```