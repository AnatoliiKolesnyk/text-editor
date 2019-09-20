import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ControlPanelService} from './control-panel.service';
import {SelectionService} from '../selection-service/selection.service';
import {SubscriptionsService} from '../subscriptions-service/subscriptions.service';
import {TextService} from '../text-service/text.service';
import {SynonymsService} from '../synonyms-service/synonyms.service';
import {Observable, of} from 'rxjs';
import {filter, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlPanelComponent implements OnInit, OnDestroy {
  private subscriptionsId: string = this.constructor.name + Date.now();
  private synonyms$: Observable<string[]> = null;

  constructor(
    public controlPanelService: ControlPanelService,
    public selectionService: SelectionService,
    private changeDetectorRef: ChangeDetectorRef,
    private subscriptionsService: SubscriptionsService,
    private textService: TextService,
    private synonymsService: SynonymsService,
  ) {
  }

  get selectionIsPresent(): boolean {
    return this.selectionService.selectionIsPresent();
  }

  ngOnInit() {
    this.buildSynonymsStream();

    this.subscriptionsService.addSubscription(
      this.subscriptionsId,
      this.subscribeOnSelection(),
    );
  }

  ngOnDestroy(): void {
    this.subscriptionsService
      .clearAllSubscriptions(this.subscriptionsId);
  }

  getSelectionMeta() {
    return this.textService.getSelectedWordMeta();
  }

  getSelectionProperty(property: string) {
    const meta = this.getSelectionMeta();
    return meta && meta[property];
  }

  getSelectionColor() {
    return this.getSelectionProperty('color') || null;
  }

  isSelectionBold() {
    return this.getSelectionProperty('bold');
  }

  isSelectionUnderline() {
    return this.getSelectionProperty('underline');
  }

  isSelectionItalic() {
    return this.getSelectionProperty('italic');
  }

  removeSelection() {
    // Really ugly huck, for some reason, Selection API doesn't
    // notice that text is unselected on button click
    // This should be fixed in a better way, but it took too long already
    // this.selectionService.getCurrentSelection().removeAllRanges();
  }

  private subscribeOnSelection() {
    return this.selectionService.selection$
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });
  }

  private buildSynonymsStream(): void {
    this.synonyms$ = this.selectionService.selection$
      .pipe(
        switchMap(selection => {
          // if (selection.isCollapsed) {
          //   return of(null);
          // }

          const selectedWord = selection.toString();
          return this.synonymsService.getSynonyms(selectedWord);
        }),
        tap(console.log)
      );
  }
}
