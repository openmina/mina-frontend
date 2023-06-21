import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@ngneat/until-destroy';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { NetworkBlocksIpcSort } from '@network/blocks-ipc/network-blocks-ipc.actions';
import { selectNetworkBlocksIpc, selectNetworkBlocksIpcSorting } from '@network/blocks-ipc/network-blocks-ipc.state';
import { NetworkBlockIpc } from '@shared/types/network/blocks-ipc/network-block-ipc.type';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-network-blocks-ipc-table',
  templateUrl: './network-blocks-ipc-table.component.html',
  styleUrls: ['./network-blocks-ipc-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class NetworkBlocksIpcTableComponent extends MinaTableWrapper<NetworkBlockIpc> implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };

  protected readonly tableHeads: TableHeadSorting<NetworkBlockIpc>[] = [
    { name: 'datetime', sort: 'timestamp' },
    { name: 'message hash', sort: 'hash' },
    { name: 'height' },
    { name: 'node address', sort: 'nodeAddress' },
    { name: 'peer address', sort: 'peerAddress' },
    { name: 'type' },
    { name: 'message type', sort: 'msgType' },
    { name: 'block latency', sort: 'blockLatency' },
  ];

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToNetworkBlocks();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [165, 130, 80, 130, 160, 130, 140, 160, 40];
    this.table.sortClz = NetworkBlocksIpcSort;
    this.table.sortSelector = selectNetworkBlocksIpcSorting;
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
