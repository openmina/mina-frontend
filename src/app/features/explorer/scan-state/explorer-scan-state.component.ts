import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, skip, take } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';
import {
  EXPLORER_SCAN_STATE_CLOSE,
  EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
  EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK,
  ExplorerScanStateClose,
  ExplorerScanStateSetActiveBlock,
  ExplorerScanStateSetEarliestBlock,
} from '@explorer/scan-state/explorer-scan-state.actions';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { EXPLORER_SNARKS_GET_SNARKS, ExplorerSnarksGetSnarks } from '@explorer/snarks/explorer-snarks.actions';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-scan-state',
  templateUrl: './explorer-scan-state.component.html',
  styleUrls: ['./explorer-scan-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerScanStateComponent implements OnInit, OnDestroy {

  private blockHeight: number;

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToActiveNodeAndBlockChange();
    this.store.dispatch<ExplorerSnarksGetSnarks>({ type: EXPLORER_SNARKS_GET_SNARKS });
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this),
        take(1),
        filter(route => route.params['height']),
      )
      .subscribe((route: MergedRoute) => {
        this.blockHeight = Number(route.params['height']);
        this.store.dispatch<ExplorerScanStateSetActiveBlock>({
          type: EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
      });
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.store.dispatch<ExplorerScanStateSetActiveBlock>({
          type: EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
      });
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(status => !!status.blockLevel),
      )
      .subscribe((status: NodeStatus) => {
        this.blockHeight = status.blockLevel;
        this.getScanState();
      });
  }

  private getScanState(): void {
    this.store.dispatch<ExplorerScanStateSetEarliestBlock>({ type: EXPLORER_SCAN_STATE_SET_EARLIEST_BLOCK, payload: { height: this.blockHeight } });
  }

  ngOnDestroy(): void {
    this.store.dispatch<ExplorerScanStateClose>({ type: EXPLORER_SCAN_STATE_CLOSE });
  }
}
