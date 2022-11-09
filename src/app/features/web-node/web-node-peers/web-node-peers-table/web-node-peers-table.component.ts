import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { selectWebNodePeersActivePeer } from '@web-node/web-node-peers/web-node-peers.state';
import { WEB_NODE_PEERS_SELECT_PEER, WebNodePeersSelectPeer } from '@web-node/web-node-peers/web-node-peers.actions';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { selectWebNodePeers } from '@web-node/web-node.state';

@UntilDestroy()
@Component({
  selector: 'mina-web-node-peers-table',
  templateUrl: './web-node-peers-table.component.html',
  styleUrls: ['./web-node-peers-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class WebNodePeersTableComponent extends ManualDetection implements OnInit {

  peers: WebNodeLog[] = [];
  activePeer: WebNodeLog;

  @ViewChild('table') private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
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
    this.store.select(selectWebNodePeers)
      .pipe(untilDestroyed(this))
      .subscribe((peers: WebNodeLog[]) => {
        this.peers = peers;
        this.detect();
      });
  }

  private listenToActivePeer(): void {
    this.store.select(selectWebNodePeersActivePeer)
      .pipe(
        untilDestroyed(this),
        filter(peer => peer !== this.activePeer),
      )
      .subscribe((row: WebNodeLog) => {
        this.activePeer = row;
        this.detect();
      });
  }

  onRowClick(peer: WebNodeLog): void {
    if (this.activePeer?.id !== peer.id) {
      this.activePeer = peer;
      this.store.dispatch<WebNodePeersSelectPeer>({ type: WEB_NODE_PEERS_SELECT_PEER, payload: peer });
    }
  }
}
