import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  EventEmitter,
  ProviderResult,
  Range,
  TextDocument,
} from 'vscode';

export type ScopeLen = {
  line: number;
  depth: number; // 0-based
  local: number;
};

export class EsSniperCodeLensProvider implements CodeLensProvider {
  private _onDidChangeCodeLenses = new EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  private scopeLensMap = new WeakMap<TextDocument, ScopeLen[]>();

  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken,
  ): ProviderResult<CodeLens[]> {
    const lens = this.scopeLensMap.get(document);
    // console.log('[EsSniperCodeLensProvider] provideCodeLenses', lens);

    if (!lens) {
      return lens;
    }

    const codeLens: CodeLens[] = [];

    lens.forEach((len) => {
      const range = new Range(len.line - 1, 0, len.line, 0);

      codeLens.push(
        new CodeLens(range, { command: '', title: `depth: ${len.depth}` }),
        new CodeLens(range, { command: '', title: `local: ${len.local}` }),
      );
    });

    return codeLens;
  }

  updateScopeLens(document: TextDocument, scopeLens: ScopeLen[]) {
    this.scopeLensMap.set(document, scopeLens);
    this._onDidChangeCodeLenses.fire();
  }
}
