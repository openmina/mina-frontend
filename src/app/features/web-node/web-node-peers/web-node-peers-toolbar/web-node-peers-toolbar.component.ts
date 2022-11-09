import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WEB_NODE_PEERS_SELECT_PEER, WebNodePeersSelectPeer } from '@web-node/web-node-peers/web-node-peers.actions';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';

@Component({
  selector: 'mina-web-node-peers-toolbar',
  templateUrl: './web-node-peers-toolbar.component.html',
  styleUrls: ['./web-node-peers-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodePeersToolbarComponent implements OnInit {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
  }

  closeSidePanel(): void {
    this.store.dispatch<WebNodePeersSelectPeer>({ type: WEB_NODE_PEERS_SELECT_PEER, payload: undefined });
  }
}
