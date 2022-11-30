import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_GLOBAL_CLOSE, NETWORK_GLOBAL_GET_GLOBAL, NetworkGlobalClose, NetworkGlobalGetGlobal } from '@network/global/network-global.actions';

@Component({
  selector: 'mina-global',
  templateUrl: './network-global.component.html',
  styleUrls: ['./network-global.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkGlobalComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.store.dispatch<NetworkGlobalGetGlobal>({ type: NETWORK_GLOBAL_GET_GLOBAL });
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkGlobalClose>({ type: NETWORK_GLOBAL_CLOSE });
  }

}
