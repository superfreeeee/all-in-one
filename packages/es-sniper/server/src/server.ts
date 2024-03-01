import {
  ProposedFeatures,
  createConnection,
  TextDocuments,
  InitializeResult,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

export const createServerConnection = () => {
  console.log('> createServerConnection');

  const connection = createConnection(ProposedFeatures.all);

  const documents = new TextDocuments(TextDocument);

  /**
   * 初始化配置
   */
  connection.onInitialize((params) => {
    console.log('> onInitialize', params);

    const result: InitializeResult = {
      capabilities: {},
    };

    return result;
  });

  /**
   * 初始化后监听回调
   */
  connection.onInitialized(() => {
    console.log('> onInitialized');
  });

  /**
   * documents 事件
   */
  documents.onDidOpen((event) => {
    console.log('> documents.onDidOpen', event);
  });

  documents.onDidChangeContent((event) => {
    console.log('> documents.onDidChangeContent', event);
  });

  documents.onDidClose((event) => {
    console.log('> documents.onDidClose', event);
  });

  connection.onDidChangeWatchedFiles((params) => {
    console.log('> onDidChangeWatchedFiles', params);
  });

  documents.listen(connection);

  return connection;
};
