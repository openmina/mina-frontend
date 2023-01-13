import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import {
  selectAggregatorActiveBlock,
  selectAggregatorActiveFilters,
  selectAggregatorAllFilters,
  selectAggregatorEarliestBlock, selectAggregatorNodeCount,
} from '@dashboard/aggregator/aggregator.state';
import {
  AGGREGATOR_SET_ACTIVE_BLOCK,
  AGGREGATOR_TOGGLE_FILTER,
  AggregatorSetActiveBlock,
  AggregatorToggleFilter,
} from '@dashboard/aggregator/aggregator.actions';

@UntilDestroy()
@Component({
  selector: 'mina-dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrls: ['./dashboard-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom flex-column' },
})
export class DashboardToolbarComponent extends ManualDetection implements OnInit {

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
    this.store.select(selectAggregatorAllFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.allFilters = filters;
        this.detect();
      });
    this.store.select(selectAggregatorActiveFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.activeFilters = filters;
        this.detect();
      });
  }

  private listenToNodeCountChanges(): void {
    this.store.select(selectAggregatorNodeCount)
      .pipe(untilDestroyed(this))
      .subscribe((count: number) => {
        this.nodeCount = count;
        this.detect();
      });
  }

  private listenToActiveBlockChanges(): void {
    this.store.select(selectAggregatorActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectAggregatorEarliestBlock)
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
    this.store.dispatch<AggregatorToggleFilter>({ type: AGGREGATOR_TOGGLE_FILTER, payload: filter });
  }

  getBlock(height: number): void {
    this.store.dispatch<AggregatorSetActiveBlock>({ type: AGGREGATOR_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
    this.router.navigate([Routes.DASHBOARD, Routes.BLOCK, height]);
  }
}
