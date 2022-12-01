import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_SNARKS_CLOSE, NETWORK_SNARKS_GET_SNARKS, NetworkSnarksClose, NetworkSnarksGetSnarks } from '@network/snarks/network-snarks.actions';
import { selectActiveNode } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-snarks',
  templateUrl: './network-snarks.component.html',
  styleUrls: ['./network-snarks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkSnarksComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe(() => {
        this.store.dispatch<NetworkSnarksGetSnarks>({ type: NETWORK_SNARKS_GET_SNARKS });
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkSnarksClose>({ type: NETWORK_SNARKS_CLOSE });
  }

}
