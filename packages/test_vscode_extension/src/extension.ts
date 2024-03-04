import { ExtensionContext, commands, window } from 'vscode';
import { Container } from './container/Container';
import { HelloWorldCommand } from './commands/HelloWorld';
import { Commands } from './commands/common/constants';
import { TextEditorState } from './commands/TextEditorState';

export function activate(context: ExtensionContext) {
  console.log(
    'Congratulations, your extension "test-vscode-extension" is now active!',
  );

  // 官方脚手架 demo
  // context.subscriptions.push(
  //   commands.registerCommand('test-vscode-extension.helloWorld', () => {
  //     window.showInformationMessage('Hello World from test-vscode-extension!');
  //   }),
  // );

  /**
   * 全局实例
   * 1. 代理注册 commands
   */
  const container = Container.create(context);
  // Commands 代理 commands.registerCommand
  container.registerCommand(new HelloWorldCommand());
  container.registerCommand(new TextEditorState());
  // container.start 代理  context.subscriptions
  container.start();

  // other
  setTimeout(() => {
    // 触发命令 => commands.executeCommand
    commands.executeCommand(Commands.HelloWorld);
    // commands.executeCommand('editor.action.addCommentLine');
  }, 3000);
}

export function deactivate() {}
