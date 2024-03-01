import * as vscode from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { registerMetaCodeLensProvider } from './MetaCodeLensProvider';
import { registerHelloWorldCommand } from './HelloWorldCommand';
import { createClient } from './EsSniperClient';

function test(context: vscode.ExtensionContext) {}

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('es-sniper is activated 123');

  test(context);

  registerHelloWorldCommand(context);
  registerMetaCodeLensProvider(context);

  client = createClient(context);
}

// This method is called when your extension is deactivated
export function deactivate() {
  if (client) {
    client.stop();
  }
}
