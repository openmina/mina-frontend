import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectBenchmarksBlockSending, selectBenchmarksSendingBatch, selectBenchmarksSentTransactionsStats } from '@benchmarks/benchmarks.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BENCHMARKS_CHANGE_TRANSACTION_BATCH, BENCHMARKS_SEND_TXS, BenchmarksChangeTransactionBatch, BenchmarksSendTxs } from '@benchmarks/benchmarks.actions';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { distinctUntilChanged, filter } from 'rxjs';

interface TransactionForm {
  batch: FormControl<number>;
}

@UntilDestroy()
@Component({
  selector: 'mina-benchmarks-toolbar',
  templateUrl: './benchmarks-toolbar.component.html',
  styleUrls: ['./benchmarks-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class BenchmarksToolbarComponent extends ManualDetection implements OnInit {

  formGroup: FormGroup<TransactionForm>;
  batch: number;
  streamSending: boolean;
  successSentTransactions: number;
  failSentTransactions: number;

  private currentBatch: number;

  constructor(private store: Store<MinaState>,
              private formBuilder: FormBuilder) { super(); }

  ngOnInit(): void {
    this.initForm();
    this.listenToTransactionChanges();
    this.listenToStressingSendStreaming();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectBenchmarksSentTransactionsStats)
      .pipe(untilDestroyed(this))
      .subscribe(stats => {
        this.successSentTransactions = stats.success;
        this.failSentTransactions = stats.fail;
        this.detect();
      });
    this.store.select(selectBenchmarksSendingBatch)
      .pipe(untilDestroyed(this))
      .subscribe(batch => {
        this.currentBatch = batch;
        this.formGroup.get('batch').setValue(batch, { emitEvent: false });
        this.detect();
      });
  }

  private listenToStressingSendStreaming(): void {
    this.store.select(selectBenchmarksBlockSending)
      .pipe(untilDestroyed(this))
      .subscribe(streamSending => {
        this.streamSending = streamSending;
        this.detect();
      });
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group<TransactionForm>({
      batch: new FormControl(0),
    });

    this.formGroup.get('batch')
      .valueChanges
      .pipe(
        untilDestroyed(this),
        distinctUntilChanged(),
        filter(v => v !== null),
      )
      .subscribe((value: number) => {
        const payload = Math.ceil(value || 1);
        this.formGroup.get('batch').patchValue(payload);
        if (this.currentBatch !== payload) {
          this.store.dispatch<BenchmarksChangeTransactionBatch>({ type: BENCHMARKS_CHANGE_TRANSACTION_BATCH, payload });
        }
      });

  }

  send(): void {
    if (!this.streamSending) {
      this.store.dispatch<BenchmarksSendTxs>({ type: BENCHMARKS_SEND_TXS });
    }
  }
}
