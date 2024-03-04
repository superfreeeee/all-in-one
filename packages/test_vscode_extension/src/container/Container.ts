import { ExtensionContext } from 'vscode';
import { Command } from '../commands/common/Command';

export class Container {
  /**
   * 单例
   */
  private static _instance: Container | undefined;

  static getInstance() {
    return this._instance;
  }

  static create(context: ExtensionContext) {
    const container = new Container(context);
    Container._instance = container;
    return container;
  }

  /**
   * 实例
   */
  private context: ExtensionContext;

  private commands: Command[] = [];

  constructor(context: ExtensionContext) {
    this.context = context;
  }

  registerCommand(command: Command) {
    this.commands.push(command);
  }

  start() {
    this.context.subscriptions.push(...this.commands);
  }
}
