import {
  ProposedFeatures,
  createConnection,
  TextDocuments,
  InitializeResult,
  TextDocumentSyncKind,
  TextDocumentChangeEvent,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { debouncedAnalyzeCode } from './analyzer';

export const createEsSniperServer = () => {
  console.log('[EsSniperServer] create start');

  const connection = createConnection(ProposedFeatures.all);

  const documents = new TextDocuments(TextDocument);

  /**
   * 初始化配置
   */
  connection.onInitialize((params) => {
    console.log('[EsSniperServer] connection.onInitialize', params);

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
    console.log('[EsSniperServer] connection.onInitialized');
  });

  let _analyzeId = 0;

  /**
   * 分析代码
   * 1. 作用域信息
   * TODO 2. 函数复杂度度量（消费）
   *
   * TODO 针对相同 textDocument 缓存
   *
   * @param event
   * @returns
   */
  const analyze = (event: TextDocumentChangeEvent<TextDocument>) => {
    const { document } = event;
    const content = document.getText();

    const id = _analyzeId++;

    console.log(`[analyze] start, id=${id}`);

    const result = debouncedAnalyzeCode(content);
    if (!result) return; // throttle return

    console.log(`[analyze] result, id=${id}`, result);

    connection.sendNotification('analyze', {
      documentUri: document.uri,
      scopeLens: result.scopeLens,
      consumptionLens: result.consumptionLens,
    });
  };

  /**
   * documents 事件
   */
  documents.onDidOpen((event) => {
    console.log('[EsSniperServer] documents.onDidOpen');
    analyze(event);
  });

  documents.onDidChangeContent((event) => {
    console.log('[EsSniperServer] documents.onDidChangeContent');
    analyze(event);
  });

  documents.onDidClose((event) => {
    console.log('[EsSniperServer] documents.onDidClose', event);
  });

  connection.onDidChangeWatchedFiles((params) => {
    console.log('[EsSniperServer] connection.onDidChangeWatchedFiles', params);
  });

  documents.listen(connection);

  return connection;
};
