import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, skip } from 'rxjs';
import {
  EXPLORER_TRANSACTIONS_CLOSE,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS,
  ExplorerTransactionsClose,
  ExplorerTransactionsGetTransactions,
} from '@explorer/transactions/explorer-transactions.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-transactions',
  templateUrl: './explorer-transactions.component.html',
  styleUrls: ['./explorer-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerTransactionsComponent implements OnInit, OnDestroy {

  private blockLevel: number;

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.getTxs();
      });
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(status => status.blockLevel !== this.blockLevel),
      )
      .subscribe((status: NodeStatus) => {
        this.blockLevel = status.blockLevel;
        this.getTxs();
      });
  }

  private getTxs(): void {
    this.store.dispatch<ExplorerTransactionsGetTransactions>({ type: EXPLORER_TRANSACTIONS_GET_TRANSACTIONS });
  }

  ngOnDestroy(): void {
    this.store.dispatch<ExplorerTransactionsClose>({ type: EXPLORER_TRANSACTIONS_CLOSE });
  }
}
