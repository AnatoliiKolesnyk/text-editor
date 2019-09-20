import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TextService} from '../text-service/text.service';
import {SelectionService} from '../selection-service/selection.service';
import {SubscriptionsService} from '../subscriptions-service/subscriptions.service';
import {BehaviorSubject} from 'rxjs';
import {WordWithMetadata} from '../text-service/word-with-metadata.interface';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit, OnDestroy {
  @ViewChild('selectionContainer') selectionContainer;

  public text$: BehaviorSubject<WordWithMetadata[]>;
  private subscriptionsId: string = this.constructor.name + Date.now();

  constructor(
    private textService: TextService,
    private selectionServiceService: SelectionService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  ngOnInit() {
    this.text$ = this.textService.getMockText();
    this.initSelectionEventsHandling();
  }

  ngOnDestroy() {
    this.subscriptionsService
      .clearAllSubscriptions(this.subscriptionsId);
  }

  initSelectionEventsHandling() {
    const subscription = this.selectionServiceService.selection$
      .subscribe();

    this.selectionServiceService
      .setSelectionContainer(this.selectionContainer.nativeElement);

    this.subscriptionsService
      .addSubscription(this.subscriptionsId, subscription);
  }

  hasNoFormat(word: WordWithMetadata) {
    return !word.bold && !word.italic && !word.underline && !word.color;
  }

  isBold(word: WordWithMetadata) {
    return word.bold;
  }

  isUnderlined(word: WordWithMetadata) {
    return word.underline;
  }

  isItalic(word: WordWithMetadata) {
    return word.italic;
  }
}
