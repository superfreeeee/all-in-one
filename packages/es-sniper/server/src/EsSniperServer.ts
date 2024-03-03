import {
  ProposedFeatures,
  createConnection,
  TextDocuments,
  InitializeResult,
  TextDocumentSyncKind,
  TextDocumentChangeEvent,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { parseCode, throttledParseCode } from './analyzer';

export const createEsSniperServer = () => {
  console.log('[EsSniperServer] create start');

  const connection = createConnection(ProposedFeatures.all);

  const documents = new TextDocuments(TextDocument);

  /**
   * 初始化配置
   */
  connection.onInitialize((params) => {
    console.log('[EsSniperServer.connection] onInitialize', params);

    const result: InitializeResult = {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Full,
      },
    };

    return result;
  });

  /**
   * 初始化后监听回调
   */
  connection.onInitialized(() => {
    console.log('[EsSniperServer.connection] onInitialized');
  });

  const analyze = (event: TextDocumentChangeEvent<TextDocument>) => {
    const { document } = event;
    console.log('  uri:', document.uri);
    console.log('  languageId:', document.languageId);
    console.log('  version:', document.version);

    const content = document.getText();

    const result = throttledParseCode(content);
    if (result) {
      connection.sendNotification('scopeAnalyze', result);
    }
  };

  /**
   * documents 事件
   */
  documents.onDidOpen((event) => {
    console.log('[EsSniperServer.documents] onDidOpen');

    analyze(event);
  });

  documents.onDidChangeContent((event) => {
    console.log('[EsSniperServer.documents] onDidChangeContent');

    analyze(event);
  });

  documents.onDidClose((event) => {
    console.log('[EsSniperServer.documents] onDidClose', event);
  });

  connection.onDidChangeWatchedFiles((params) => {
    console.log('[EsSniperServer.documents] onDidChangeWatchedFiles', params);
  });

  documents.listen(connection);

  return connection;
};
