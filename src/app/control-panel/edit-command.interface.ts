import {EditCommandType} from './edit-command.enum';

export interface EditCommand {
  type: EditCommandType;
  value?: string;
}
