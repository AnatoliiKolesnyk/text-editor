import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WordWithMetadata} from './word-with-metadata.interface';
import {SelectionService} from '../selection-service/selection.service';
import {ControlPanelService} from '../control-panel/control-panel.service';
import {EditCommandType} from '../control-panel/edit-command.enum';

@Injectable()
export class TextService {
  readonly text$: BehaviorSubject<WordWithMetadata[]>;
  private mockText = 'A year ago I was in the audience at a gathering of designers in San Francisco. ' +
    'There were four designers on stage, and two of them worked for me. I was there to support them. ' +
    'The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. ' +
    'What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, ' +
    'that modern design problems were very complex. And we ought to need a license to solve them.';

  private textMetadata: Array<WordWithMetadata>;

  constructor(
    private controlPanelService: ControlPanelService,
    private selectionService: SelectionService,
  ) {
    this.initTextMetaData();

    this.text$ = new BehaviorSubject(
      this.textMetadata
    );

    this.subscribeOnTextEditions();
  }

  getMockText() {
    return this.text$;
  }

  public getSelectedWordMeta() {
    if (!this.selectionService.selectionIsPresent()) {
      return null;
    }

    return this.textMetadata[this.getSelectedWordIndex()];
  }

  private initTextMetaData(): void {
    const words = this.mockText.split(/\s+/);

    this.textMetadata = words.map(word => {
      return {
        text: word,
        bold: false,
        italic: false,
        underline: false,
      };
    });
  }

  private getSelectedWordIndex(): number {
    if (!this.selectionService.selectionIsPresent()) {
      return -1;
    }

    const selection = this.selectionService.getCurrentSelection();
    const wordTextNode = selection.anchorNode;

    let index = 0;
    let node = wordTextNode;
    if (node.parentElement.tagName === 'SPAN') {
      node = node.parentElement;
    }
    while (node.previousSibling) {
      node = node.previousSibling;
      if (
        node.nodeType === 3 && node.nodeValue.trim() ||
        node.nodeType === 1
      ) {
        index++;
      }
    }

    return index;
  }

  private subscribeOnTextEditions() {
    this.controlPanelService.commands$.subscribe(command => {
      const selectedWordMeta = this.getSelectedWordMeta();

      switch (command.type) {
        case EditCommandType.ToggleBold:
          selectedWordMeta.bold = !selectedWordMeta.bold;
          break;

        case EditCommandType.ToggleItalic:
          selectedWordMeta.italic = !selectedWordMeta.italic;
          break;

        case EditCommandType.ToggleUnderline:
          selectedWordMeta.underline = !selectedWordMeta.underline;
          break;

        case EditCommandType.ChangeColor:
          selectedWordMeta.color = command.value;
          break;

        case EditCommandType.ReplaceWord:
          selectedWordMeta.text = command.value;
          break;
        default:
          console.warn(`Unknown command ${command}`);
      }

      this.text$.next(this.textMetadata);
    });
  }
}
