import * as vscode from 'vscode';

export const registerHelloWorldCommand = (context: vscode.ExtensionContext) => {
  const disposable = vscode.commands.registerCommand(
    'es-sniper.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from es-sniper!');
    },
  );

  context.subscriptions.push(disposable);
};
