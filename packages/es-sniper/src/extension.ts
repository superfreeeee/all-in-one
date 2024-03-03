import * as vscode from 'vscode';
import { registerMetaCodeLensProvider } from './MetaCodeLensProvider';
import { registerHelloWorldCommand } from './HelloWorldCommand';
import { EsSniperClient } from './EsSniperClient';

function test(context: vscode.ExtensionContext) {}

let client: EsSniperClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('es-sniper is activated');

  test(context);

  registerHelloWorldCommand(context);
  registerMetaCodeLensProvider(context);

  client = new EsSniperClient(context);

  client.start();
}

// This method is called when your extension is deactivated
export function deactivate() {
  client?.stop();
}
