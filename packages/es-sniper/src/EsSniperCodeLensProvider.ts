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

type ConsumptionInfo = Record<string, number>;

export type ConsumptionLen = {
  line: number;
  consumption: ConsumptionInfo;
};

export class EsSniperCodeLensProvider implements CodeLensProvider {
  private _onDidChangeCodeLenses = new EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  private scopeLensMap = new WeakMap<TextDocument, ScopeLen[]>();
  private consumptionLensMap = new WeakMap<TextDocument, ConsumptionLen[]>();

  provideCodeLenses(
    document: TextDocument,
    token: CancellationToken,
  ): ProviderResult<CodeLens[]> {
    const codeLens: CodeLens[] = [];

    const scopeLens = this.scopeLensMap.get(document);
    if (scopeLens) {
      scopeLens.forEach((len) => {
        const range = new Range(len.line - 1, 0, len.line, 0);

        codeLens.push(
          new CodeLens(range, { command: '', title: `depth: ${len.depth}` }),
          new CodeLens(range, { command: '', title: `local: ${len.local}` }),
        );
      });
    }

    const consumptionLens = this.consumptionLensMap.get(document);
    if (consumptionLens) {
      consumptionLens.forEach((len) => {
        const range = new Range(len.line - 1, 0, len.line, 0);
        const refs = Object.keys(len.consumption).length;

        codeLens.push(
          new CodeLens(range, { command: '', title: `closure: ${refs}` }),
        );
      });
    }

    return codeLens;
  }

  updateScopeLens(document: TextDocument, scopeLens: ScopeLen[]) {
    this.scopeLensMap.set(document, scopeLens);
    this._onDidChangeCodeLenses.fire();
  }

  updateConsumptionLens(
    document: TextDocument,
    consumptionLens: ConsumptionLen[],
  ) {
    this.consumptionLensMap.set(document, consumptionLens);
    this._onDidChangeCodeLenses.fire();
  }
}
