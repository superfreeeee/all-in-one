import {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  EventEmitter,
  ProviderResult,
  Range,
  TextDocument,
} from 'vscode';

type AnalyzeResult = {
  line: number;
  depth: number;
  localCount: number;
};

export class EsSniperCodeLensProvider implements CodeLensProvider {
  private lensMap = new WeakMap<TextDocument, AnalyzeResult[]>();
  private _onDidChangeCodeLenses = new EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken,
  ): ProviderResult<CodeLens[]> {
    const lens = this.lensMap.get(document);
    // console.log('[EsSniperCodeLensProvider] provideCodeLenses', lens);

    if (!lens) {
      return lens;
    }

    const codeLens: CodeLens[] = [];

    lens.forEach((len) => {
      const range = new Range(len.line - 1, 0, len.line, 0);

      codeLens.push(
        new CodeLens(range, {
          command: '',
          title: `depth: ${len.depth}`,
        }),
        new CodeLens(range, {
          command: '',
          title: `local: ${len.localCount}`,
        }),
      );
    });

    return codeLens;
  }

  updateLens(document: TextDocument, lens) {
    this.lensMap.set(document, lens);
    this._onDidChangeCodeLenses.fire();
  }
}
