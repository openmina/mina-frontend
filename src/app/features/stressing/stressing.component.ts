import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import { STRESSING_INIT, StressingInit } from '@stressing/stressing.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectStressingFetchingValues, selectStressingTransactions } from '@stressing/stressing.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { StressingTransaction } from '@shared/types/stressing/stressing-transaction.type';

@UntilDestroy()
@Component({
  selector: 'mina-stressing',
  templateUrl: './stressing.component.html',
  styleUrls: ['./stressing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StressingComponent extends ManualDetection implements OnInit {

  interval: number;
  batch: number;
  transactions: StressingTransaction[] = [];

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.WALLETS, Routes.TRANSACTIONS] });
    this.store.dispatch<StressingInit>({ type: STRESSING_INIT });
    this.listenToFetchingValuesChanges();
    this.listenToTransactionChanges();
  }

  private listenToTransactionChanges(): void {
    this.store.select(selectStressingTransactions)
      .pipe(untilDestroyed(this))
      .subscribe(transactions => {
        this.transactions = transactions;
        this.detect();
      });
  }

  private listenToFetchingValuesChanges(): void {
    this.store.select(selectStressingFetchingValues)
      .pipe(untilDestroyed(this))
      .subscribe(({ interval, batch }) => {
        this.interval = interval;
        this.batch = batch;
        this.detect();
      });
  }
}
