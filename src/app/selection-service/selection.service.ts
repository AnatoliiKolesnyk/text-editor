import {Injectable} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {filter, map, share, tap} from 'rxjs/operators';
import {ControlPanelService} from '../control-panel/control-panel.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  public selection$: Observable<Selection>;
  private selectionMethod: () => Selection;
  private lastSelection: Selection = null;
  private selectionContainer: HTMLElement = null;

  constructor() {
    this.setSelectionMethod();

    this.selection$ = fromEvent<Selection>(document, 'selectionchange')
      .pipe(
        map(() => this.selectionMethod()),
        tap(selection => (this.lastSelection = selection)),
        filter(selection => {
          return !this.selectionContainer ||
            selection.isCollapsed ||
            this.selectionContainer.contains(selection.anchorNode);
        }),
        share(),
      );
  }

  public getCurrentSelection(): Selection {
    return this.lastSelection;
  }

  public selectionIsPresent(): boolean {
    return this.lastSelection &&
      !this.lastSelection.isCollapsed &&
      !!this.lastSelection.toString().trim();
  }

  public setSelectionContainer(container: HTMLElement) {
    this.selectionContainer = container;
  }

  private setSelectionMethod() {
    if (window.getSelection) {
      this.selectionMethod = () => window.getSelection();
    } else if (document.getSelection) {
      this.selectionMethod = () => document.getSelection();
    } else if ((<any>document).selection) {
      this.selectionMethod = () => (<any>document).selection.createRange().text;
    } else {
      return;
    }
  }
}
