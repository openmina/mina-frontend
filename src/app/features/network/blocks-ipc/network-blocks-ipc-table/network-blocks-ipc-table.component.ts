import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { NetworkBlocksIpcSort } from '@network/blocks-ipc/network-blocks-ipc.actions';
import { selectNetworkBlocksIpc, selectNetworkBlocksIpcSorting } from '@network/blocks-ipc/network-blocks-ipc.state';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@Component({
  selector: 'mina-network-blocks-ipc-table',
  templateUrl: './network-blocks-ipc-table.component.html',
  styleUrls: ['./network-blocks-ipc-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class NetworkBlocksIpcTableComponent extends StoreDispatcher implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  private readonly tableHeads: TableHeadSorting<NetworkBlockIpc>[] = [
    { name: 'datetime', sort: 'timestamp' },
    { name: 'message hash', sort: 'hash' },
    { name: 'height' },
    { name: 'node address', sort: 'nodeAddress' },
    { name: 'peer address', sort: 'peerAddress' },
    { name: 'type' },
    { name: 'message type', sort: 'msgType' },
    { name: 'block latency', sort: 'blockLatency' },
  ];

  private table: MinaTableComponent<NetworkBlockIpc>;

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<NetworkBlockIpc>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<NetworkBlockIpc>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [165, 130, 80, 130, 160, 130, 140, 160, 40];
      this.table.sortClz = NetworkBlocksIpcSort;
      this.table.sortSelector = selectNetworkBlocksIpcSorting;
      this.table.init();
    });
    this.listenToNetworkBlocks();
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocksIpc)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlockIpc[]) => {
        this.table.rows = blocks;
        this.table.detect();
      });
  }

  seeMessagesForAddress(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
      queryParamsHandling: 'merge',
    });
  }
}
