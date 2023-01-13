import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import {
  AGGREGATOR_IPC_SET_ACTIVE_BLOCK,
  AGGREGATOR_IPC_TOGGLE_FILTER,
  AggregatorIpcSetActiveBlock,
  AggregatorIpcToggleFilter,
} from '@dashboard/aggregator-ipc/aggregator-ipc.actions';
import {
  selectAggregatorIpcActiveBlock,
  selectAggregatorIpcActiveFilters,
  selectAggregatorIpcAllFilters,
  selectAggregatorIpcEarliestBlock,
  selectAggregatorIpcNodeCount,
} from '@dashboard/aggregator-ipc/aggregator-ipc.state';

@UntilDestroy()
@Component({
  selector: 'mina-aggregator-ipc-toolbar',
  templateUrl: './aggregator-ipc-toolbar.component.html',
  styleUrls: ['./aggregator-ipc-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom flex-column' },
})
export class AggregatorIpcToolbarComponent extends ManualDetection implements OnInit {

  activeFilters: string[] = [];
  allFilters: string[] = [];
  activeBlock: number;
  earliestBlock: number;
  nodeCount: number;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToNodeCountChanges();
    this.listenToActiveBlockChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectAggregatorIpcAllFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.allFilters = filters;
        this.detect();
      });
    this.store.select(selectAggregatorIpcActiveFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.activeFilters = filters;
        this.detect();
      });
  }

  private listenToNodeCountChanges(): void {
    this.store.select(selectAggregatorIpcNodeCount)
      .pipe(untilDestroyed(this))
      .subscribe((count: number) => {
        this.nodeCount = count;
        this.detect();
      });
  }

  private listenToActiveBlockChanges(): void {
    this.store.select(selectAggregatorIpcActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectAggregatorIpcEarliestBlock)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(earliestBlock => this.earliestBlock !== earliestBlock),
      )
      .subscribe((earliestBlock: number) => {
        this.earliestBlock = earliestBlock;
        this.detect();
      });
  }

  toggleFilter(filter: string): void {
    this.store.dispatch<AggregatorIpcToggleFilter>({ type: AGGREGATOR_IPC_TOGGLE_FILTER, payload: filter });
  }

  getBlock(height: number): void {
    this.store.dispatch<AggregatorIpcSetActiveBlock>({ type: AGGREGATOR_IPC_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
    this.router.navigate([Routes.DASHBOARD, Routes.LIBP2P, height]);
  }
}
