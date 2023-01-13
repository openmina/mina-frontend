import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, merge, take, timer } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppNodeStatus } from '@app/app.state';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import {
  AGGREGATOR_IPC_CLOSE,
  AGGREGATOR_IPC_GET_EARLIEST_BLOCK,
  AGGREGATOR_IPC_INIT,
  AGGREGATOR_IPC_SET_ACTIVE_BLOCK,
  AggregatorIpcClose,
  AggregatorIpcGetEarliestBlock,
  AggregatorIpcInit,
  AggregatorIpcSetActiveBlock,
} from '@dashboard/aggregator-ipc/aggregator-ipc.actions';

@UntilDestroy()
@Component({
  selector: 'mina-aggregator-ipc',
  templateUrl: './aggregator-ipc.component.html',
  styleUrls: ['./aggregator-ipc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregatorIpcComponent extends ManualDetection implements OnInit, OnDestroy {

  private blockHeight: number;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToActiveBlockChangeFromNode();
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
        this.store.dispatch<AggregatorIpcSetActiveBlock>({
          type: AGGREGATOR_IPC_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
        this.store.dispatch<AggregatorIpcInit>({ type: AGGREGATOR_IPC_INIT });
      });
  }

  private listenToActiveBlockChangeFromNode(): void {
    merge(
      this.store.select(selectAppNodeStatus)
        .pipe(
          untilDestroyed(this),
          filter(Boolean),
          filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING),
        ),
      timer(0, 10000),
    )
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.store.dispatch<AggregatorIpcGetEarliestBlock>({ type: AGGREGATOR_IPC_GET_EARLIEST_BLOCK });
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<AggregatorIpcClose>({ type: AGGREGATOR_IPC_CLOSE });
  }
}
