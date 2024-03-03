import path from 'path';
import { ExtensionContext, languages, workspace } from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import {
  ConsumptionLen,
  EsSniperCodeLensProvider,
  ScopeLen,
} from './EsSniperCodeLensProvider';

const SERVER_PATH = path.join('server/dist/index.cjs');

const SUPPORT_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

type EsSniperServerAnalyzeEvent = {
  documentUri: string;
  scopeLens: ScopeLen[];
  consumptionLens: ConsumptionLen[];
};

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
    console.log('[EsSniperClient] initClient: start');

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

    console.log('[EsSniperClient] initClient: options', {
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

    client.onNotification('analyze', (event: EsSniperServerAnalyzeEvent) => {
      console.log('[EsSniperClient] onNotification.analyze:', event);
      this.handleAnalyze(event);
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

  /**
   * EsSniperClient Notification: scopeLens 事件
   * @param event
   */
  private handleAnalyze(event: EsSniperServerAnalyzeEvent) {
    const { documentUri, scopeLens, consumptionLens } = event;

    const targetDocument = workspace.textDocuments.find((document) => {
      return document.uri.toString() === documentUri;
    });

    if (!targetDocument) {
      console.error(
        '[EsSniperClient] scopeLens document not found',
        event.documentUri,
      );
      return;
    }

    this.codeLensProvider.updateScopeLens(targetDocument, scopeLens);
    this.codeLensProvider.updateConsumptionLens(
      targetDocument,
      consumptionLens,
    );
  }

  start() {
    this.client.start();
  }

  stop() {
    this.client.stop();
  }
}
