import { Selection, window } from 'vscode';
import { Command } from './common/Command';
import { Commands } from './common/constants';

export class TextEditorState extends Command {
  constructor() {
    super(Commands.TextEditorState);
  }

  execute(): void {
    const textEditor = window.activeTextEditor;
    if (!textEditor) return;

    showSelection(textEditor.selection);

    // console.log('> document', textEditor.document);
    // console.log('> selection', textEditor.selection);
    // console.log('> selections', textEditor.selections);
    // console.log('> viewColumn', textEditor.viewColumn);
    // console.log('> visibleRanges', textEditor.visibleRanges);
  }
}

const showSelection = (selection: Selection) => {
  const { anchor, active } = selection;
  console.log(
    `Selection: (${anchor.line}.${anchor.character}).(${active.line}.${active.character})`,
  );
};
