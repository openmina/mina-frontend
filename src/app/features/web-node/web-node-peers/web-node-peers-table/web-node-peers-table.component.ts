import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { selectWebNodePeersActivePeer } from '@web-node/web-node-peers/web-node-peers.state';
import { WebNodePeersSelectPeer } from '@web-node/web-node-peers/web-node-peers.actions';
import { HorizontalResizableContainerOldComponent } from '../../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { selectWebNodePeers } from '@web-node/web-node.state';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-web-node-peers-table',
  templateUrl: './web-node-peers-table.component.html',
  styleUrls: ['./web-node-peers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class WebNodePeersTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<WebNodeLog> = [
    { name: 'ID' },
    { name: 'datetime' },
    { name: 'peer ID' },
    { name: 'kind' },
    { name: 'summary' },
    { name: 'level' },
  ];

  activePeer: WebNodeLog;
  isActiveRow: boolean;

  @ViewChild('table') private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<WebNodeLog>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<WebNodeLog>;
  private removedClass: boolean;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<WebNodeLog>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [70, 155, 210, 200, 400, 200];
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((row: WebNodeLog) => this.onRowClick(row));
      this.table.propertyForActiveCheck = 'id';
      this.table.init();
    });
    this.listenToWebNodePeersChanges();
    this.listenToActivePeer();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToWebNodePeersChanges(): void {
    this.select(selectWebNodePeers, (peers: WebNodeLog[]) => {
      this.table.rows = peers || [];
      this.table.detect();
    });
  }

  private listenToActivePeer(): void {
    this.select(selectWebNodePeersActivePeer, (row: WebNodeLog) => {
      this.activePeer = row;
      this.table.activeRow = row;
      this.table.detect();

      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
      }
      this.detect();
    }, filter(peer => peer !== this.activePeer));
  }

  onRowClick(peer: WebNodeLog): void {
    if (this.activePeer?.id !== peer.id) {
      this.activePeer = peer;
      this.dispatch(WebNodePeersSelectPeer, peer);
    }
  }
}
