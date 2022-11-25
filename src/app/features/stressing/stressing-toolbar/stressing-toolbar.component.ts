import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectStressingFetchingValues, selectStressingSentTransactionsStats, selectStressingStreamSending } from '@stressing/stressing.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import {
  STRESSING_CHANGE_TRANSACTION_BATCH,
  STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL,
  STRESSING_STREAM_SENDING_LIVE,
  STRESSING_STREAM_SENDING_PAUSE,
  StressingChangeTransactionBatch,
  StressingChangeTransactionSendingInterval,
  StressingStreamSendingLive,
  StressingStreamSendingPause,
} from '@stressing/stressing.actions';

interface TransactionForm {
  batch: FormControl<number>;
  interval: FormControl<number>;
}

@UntilDestroy()
@Component({
  selector: 'mina-stressing-toolbar',
  templateUrl: './stressing-toolbar.component.html',
  styleUrls: ['./stressing-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class StressingToolbarComponent extends ManualDetection implements OnInit {

  interval: number;
  batch: number;
  formGroup: FormGroup<TransactionForm>;
  sendStreaming: boolean;
  successSentTransactions: number;
  failSentTransactions: number;

  constructor(private store: Store<MinaState>,
              private formBuilder: FormBuilder) { super(); }

  ngOnInit(): void {
    this.initForm();
    this.listenToFetchingValuesChanges();
    this.listenToTransactionChanges();
    this.listenToStressingSendStreaming();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectStressingSentTransactionsStats)
      .pipe(untilDestroyed(this))
      .subscribe(stats => {
        this.successSentTransactions = stats.success;
        this.failSentTransactions = stats.fail;
        this.detect();
      });
  }

  private listenToStressingSendStreaming(): void {
    this.store.select(selectStressingStreamSending)
      .pipe(untilDestroyed(this))
      .subscribe(sendStreaming => {
        this.sendStreaming = sendStreaming;
        this.detect();
      });
  }

  private listenToFetchingValuesChanges(): void {
    this.store.select(selectStressingFetchingValues)
      .pipe(
        untilDestroyed(this),
        filter(({ interval, batch }) => this.interval !== interval || this.batch !== batch),
      )
      .subscribe(({ interval, batch }) => {
        this.interval = interval;
        this.batch = batch;
        this.formGroup.patchValue({ batch, interval: Number(interval.toFixed(2)) }, { emitEvent: false });
        this.detect();
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group<TransactionForm>({
      batch: new FormControl(),
      interval: new FormControl(),
    });

    this.formGroup.get('batch')
      .valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        debounceTime(400),
        filter(v => v !== null),
      )
      .subscribe((value: number) => {
        const payload = Math.ceil(value || 1);
        this.formGroup.get('batch').patchValue(payload, { emitEvent: false });
        this.store.dispatch<StressingChangeTransactionBatch>({ type: STRESSING_CHANGE_TRANSACTION_BATCH, payload });
      });

    this.formGroup.get('interval')
      .valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        debounceTime(400),
        filter(v => v !== null),
      )
      .subscribe((value: number) => {
        this.formGroup.get('interval').patchValue(value, { emitEvent: false });
        this.store.dispatch<StressingChangeTransactionSendingInterval>({ type: STRESSING_CHANGE_TRANSACTION_SENDING_INTERVAL, payload: value });
      });
  }

  goLive(): void {
    if (!this.sendStreaming) {
      this.store.dispatch<StressingStreamSendingLive>({ type: STRESSING_STREAM_SENDING_LIVE });
    }
  }

  pause(): void {
    if (this.sendStreaming) {
      this.store.dispatch<StressingStreamSendingPause>({ type: STRESSING_STREAM_SENDING_PAUSE });
    }
  }
}
