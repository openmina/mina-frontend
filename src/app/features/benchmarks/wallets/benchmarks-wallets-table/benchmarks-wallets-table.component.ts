import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { BenchmarksWallet } from '@shared/types/benchmarks/wallets/benchmarks-wallet.type';
import { filter, skip } from 'rxjs';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { BenchmarksWalletsGetWallets } from '@benchmarks/wallets/benchmarks-wallets.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { selectBenchmarksWallets } from '@benchmarks/wallets/benchmarks-wallets.state';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@Component({
  selector: 'mina-benchmarks-wallets-table',
  templateUrl: './benchmarks-wallets-table.component.html',
  styleUrls: ['./benchmarks-wallets-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class BenchmarksWalletsTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<BenchmarksWallet> = [
    { name: 'public key' },
    { name: 'balance' },
    { name: 'nonce' },
    { name: 'pool nonce' },
    { name: 'last tx. time' },
    { name: 'last tx. memo' },
    { name: 'last tx. status' },
    { name: 'txs. ratio' },
  ];

  private blockLevel: number;

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<BenchmarksWallet>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<BenchmarksWallet>;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<BenchmarksWallet>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [220, 170, 100, 105, 170, 140, 125, 160];
      this.table.init();
    });
    this.listenToActiveNodeChange();
    this.listenToWalletChanges();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(BenchmarksWalletsGetWallets);
    }, filter(Boolean), skip(1));

    this.select(selectAppNodeStatus, (status: NodeStatus) => {
      this.blockLevel = status.blockLevel;
      this.dispatch(BenchmarksWalletsGetWallets);
    }, filter(Boolean), filter(status => status.blockLevel !== this.blockLevel));
  }

  private listenToWalletChanges(): void {
    this.select(selectBenchmarksWallets, (wallets: BenchmarksWallet[]) => {
      this.table.rows = wallets;
      this.table.detect();
    }, filter(wallets => wallets.length > 0));
  }
}

