import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { WEB_NODE_PEERS_CLOSE, WebNodePeersClose } from '@web-node/web-node-peers/web-node-peers.actions';

@Component({
  selector: 'mina-web-node-peers',
  templateUrl: './web-node-peers.component.html',
  styleUrls: ['./web-node-peers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebNodePeersComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.store.dispatch<WebNodePeersClose>({ type: WEB_NODE_PEERS_CLOSE });
  }
}
