import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  NETWORK_TRANSACTIONS_CLOSE,
  NETWORK_TRANSACTIONS_GET_TRANSACTIONS,
  NetworkTransactionsClose,
  NetworkTransactionsGetTransactions,
} from '@network/transactions/network-transactions.actions';
import { selectActiveNode } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-transactions',
  templateUrl: './network-transactions.component.html',
  styleUrls: ['./network-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkTransactionsComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch<NetworkTransactionsGetTransactions>({ type: NETWORK_TRANSACTIONS_GET_TRANSACTIONS });
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkTransactionsClose>({ type: NETWORK_TRANSACTIONS_CLOSE });
  }

}
