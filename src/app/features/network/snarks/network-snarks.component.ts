import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_SNARKS_CLOSE, NETWORK_SNARKS_GET_SNARKS, NetworkSnarksClose, NetworkSnarksGetSnarks } from '@network/snarks/network-snarks.actions';

@Component({
  selector: 'mina-snarks',
  templateUrl: './network-snarks.component.html',
  styleUrls: ['./network-snarks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSnarksComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.store.dispatch<NetworkSnarksGetSnarks>({ type: NETWORK_SNARKS_GET_SNARKS });
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkSnarksClose>({ type: NETWORK_SNARKS_CLOSE });
  }

}
