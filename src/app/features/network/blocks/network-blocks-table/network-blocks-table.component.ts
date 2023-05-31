import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { selectNetworkBlocks, selectNetworkBlocksSorting } from '@network/blocks/network-blocks.state';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { NetworkBlocksSort } from '@network/blocks/network-blocks.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@Component({
  selector: 'mina-network-blocks-table',
  templateUrl: './network-blocks-table.component.html',
  styleUrls: ['./network-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class NetworkBlocksTableComponent extends StoreDispatcher implements OnInit {

  readonly secConfig: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-', color: true, red: 30, orange: 5 };

  private readonly tableHeads: TableColumnList<NetworkBlock> = [
    { name: 'ID', sort: 'messageId' },
    { name: 'datetime', sort: 'date' },
    { name: 'message hash', sort: 'hash' },
    { name: 'height' },
    { name: 'from', sort: 'sender' },
    { name: 'to', sort: 'receiver' },
    { name: 'recv. time', sort: 'receivedLatency' },
    { name: 'sent time', sort: 'sentLatency' },
    { name: 'message kind', sort: 'messageKind' },
  ];

  private table: MinaTableComponent<NetworkBlock>;

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<NetworkBlock>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<NetworkBlock>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [90, 165, 125, 80, 150, 150, 110, 110, 160, 40];
      this.table.sortClz = NetworkBlocksSort;
      this.table.sortSelector = selectNetworkBlocksSorting;
      this.table.init();
    });
    this.listenToNetworkBlocks();
  }

  seeMessageInMessages(messageId: number): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES, messageId], { queryParamsHandling: 'merge' });
  }

  seeMessagesForAddress(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
      queryParamsHandling: 'merge',
    });
  }

  private listenToNetworkBlocks(): void {
    this.select(selectNetworkBlocks, (blocks: NetworkBlock[]) => {
      this.table.rows = blocks;
      this.table.detect();
    });
  }
}
