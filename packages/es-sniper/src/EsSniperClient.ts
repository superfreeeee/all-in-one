import path from 'path';
import { ExtensionContext } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

export const createClient = (context: ExtensionContext) => {
  const serverModule = context.asAbsolutePath(
    path.join('server/dist/index.js'),
  );

  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc },
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ language: '*' }],
    synchronize: {},
  };

  const client = new LanguageClient(
    'esSniper',
    'es-sniper',
    serverOptions,
    clientOptions,
  );

  return client;
};
