import * as vscode from 'vscode';

class MetaCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(
    document: vscode.TextDocument,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const metaLens = this.getMetaLens(document);
    return [metaLens];
  }

  private getMetaLens(document: vscode.TextDocument) {
    const firstLine = new vscode.Range(0, 0, 0, 0);
    const lens = new vscode.CodeLens(firstLine, {
      command: '',
      title: `${document.languageId}, lineCount: ${document.lineCount}`,
    });
    return lens;
  }
}

export const registerMetaCodeLensProvider = (
  context: vscode.ExtensionContext,
) => {
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider('*', new MetaCodeLensProvider()),
  );
};
