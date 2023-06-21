import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { filter, skip } from 'rxjs';
import { ExplorerTransactionsClose, ExplorerTransactionsGetTransactions } from '@explorer/transactions/explorer-transactions.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-explorer-transactions',
  templateUrl: './explorer-transactions.component.html',
  styleUrls: ['./explorer-transactions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerTransactionsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  private blockLevel: number;

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.select(selectActiveNode, () => {
      this.getTxs();
    }, filter(Boolean), skip(1));
    this.select(selectAppNodeStatus, (status: NodeStatus) => {
      this.blockLevel = status.blockLevel;
      this.getTxs();
    }, filter(Boolean), filter(status => status.blockLevel !== this.blockLevel));
  }

  private getTxs(): void {
    this.dispatch(ExplorerTransactionsGetTransactions);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ExplorerTransactionsClose);
  }
}
