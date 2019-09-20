import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {EditCommand} from './edit-command.interface';
import {filter} from 'rxjs/operators';
import {EditCommandType} from './edit-command.enum';
import {SelectionService} from '../selection-service/selection.service';

@Injectable({
  providedIn: 'root'
})
export class ControlPanelService {
  private commandsSubject = new BehaviorSubject<EditCommand>(null);

  readonly commands$: Observable<EditCommand> = this.commandsSubject
    .pipe(filter(Boolean));

  constructor(
    private selectionService: SelectionService,
  ) {}

  sendCommand(command: EditCommand) {
    this.commandsSubject.next(command);
  }

  toggleBold() {
    this.sendCommand({
      type: EditCommandType.ToggleBold,
    });
  }

  toggleUnderline() {
    this.sendCommand({
      type: EditCommandType.ToggleUnderline,
    });
  }

  toggleItalic() {
    this.sendCommand({
      type: EditCommandType.ToggleItalic,
    });
  }

  setColor(color: string) {
    if (!color) {
      return;
    }
    this.sendCommand({
      type: EditCommandType.ChangeColor,
      value: color,
    });
  }

  replaceWord(synonym: string) {
    this.sendCommand({
      type: EditCommandType.ReplaceWord,
      value: synonym,
    });
  }
}
