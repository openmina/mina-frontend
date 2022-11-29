import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_SNARKS_CLOSE, NETWORK_SNARKS_GET_SNARKS, NetworkSnarksClose, NetworkSnarksGetSnarks } from '@network/snarks/network-snarks.actions';
import { NETWORK_TRANSACTIONS_GET_TRANSACTIONS, NetworkTransactionsGetTransactions } from '@network/transactions/network-transactions.actions';

@Component({
  selector: 'mina-transactions',
  templateUrl: './network-transactions.component.html',
  styleUrls: ['./network-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkTransactionsComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.store.dispatch<NetworkTransactionsGetTransactions>({ type: NETWORK_TRANSACTIONS_GET_TRANSACTIONS });
  }

  ngOnDestroy(): void {
    // this.store.dispatch<NetworkSnarksClose>({ type: NETWORK_SNARKS_CLOSE });
  }

}
