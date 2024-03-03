import path from 'path';
import { ExtensionContext, languages, window } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import { EsSniperCodeLensProvider } from './EsSniperCodeLensProvider';

const SERVER_PATH = path.join('server/dist/index.js');

const SUPPORT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

export class EsSniperClient {
  private context: ExtensionContext;
  private codeLensProvider: EsSniperCodeLensProvider;
  private client: LanguageClient;

  constructor(context: ExtensionContext) {
    this.context = context;
    this.codeLensProvider = this.initCodeLens();
    this.client = this.initClient();
  }

  private initClient() {
    console.log('[EsSniperClient.initClient] start');

    const serverModule = this.context.asAbsolutePath(SERVER_PATH);

    const serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: { module: serverModule, transport: TransportKind.ipc },
    };

    const clientOptions: LanguageClientOptions = {
      documentSelector: SUPPORT_LANGUAGES.map((lang) => {
        return { scheme: 'file', language: lang };
      }),
      // synchronize: {
      //   // Notify the server about file changes to '.clientrc files contained in the workspace
      //   fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
      // },
    };

    console.log('[EsSniperClient.initClient] options', {
      serverModule,
      serverOptions,
      clientOptions,
    });

    const client = new LanguageClient(
      'esSniper',
      'es-sniper',
      serverOptions,
      clientOptions,
    );

    client.onNotification('scopeAnalyze', (event) => {
      console.log('[EsSniperClient] scopeAnalyze', event);
      if (window.activeTextEditor) {
        this.codeLensProvider.updateLens(
          window.activeTextEditor.document,
          event.collections,
        );
      }
      console.log();
    });

    return client;
  }

  private initCodeLens() {
    const codeLensProvider = new EsSniperCodeLensProvider();

    this.context.subscriptions.push(
      languages.registerCodeLensProvider(SUPPORT_LANGUAGES, codeLensProvider),
    );

    return codeLensProvider;
  }

  start() {
    this.client.start();
  }

  stop() {
    this.client.stop();
  }
}
