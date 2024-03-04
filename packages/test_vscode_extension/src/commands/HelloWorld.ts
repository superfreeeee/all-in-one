import { window } from 'vscode';
import { Command } from './common/Command';
import { Commands } from './common/constants';

export class HelloWorldCommand extends Command {
  constructor() {
    super(Commands.HelloWorld);
  }

  execute(): void {
    window.showInformationMessage('HelloWorldCommand called!');
    console.log(window.activeColorTheme);
  }
}
