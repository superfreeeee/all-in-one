import { Disposable, commands } from 'vscode';

export abstract class Command implements Disposable {
  private _disposable: Disposable;

  constructor(command: string) {
    this._disposable = commands.registerCommand(command, () => {
      this.execute();
    });
  }

  abstract execute(): void;

  dispose() {
    return this._disposable;
  }
}
