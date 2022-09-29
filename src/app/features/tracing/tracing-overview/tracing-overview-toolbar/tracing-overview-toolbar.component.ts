import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { selectTracingOverviewCondensedView, selectTracingOverviewSortDirection } from '@tracing/tracing-overview/tracing-overview.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  TRACING_OVERVIEW_SORT,
  TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW,
  TracingOverviewSort,
  TracingOverviewToggleCondensedView,
} from '@tracing/tracing-overview/tracing-overview.actions';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-overview-toolbar',
  templateUrl: './tracing-overview-toolbar.component.html',
  styleUrls: ['./tracing-overview-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center flex-between pl-12' },
})
export class TracingOverviewToolbarComponent extends ManualDetection implements OnInit {

  readonly SORT_DIRECTIONS = SortDirection;
  currentSort: SortDirection;
  condensedView: boolean;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSortChange();
    this.listenToCondensedViewChange();
  }

  private listenToSortChange(): void {
    this.store.select(selectTracingOverviewSortDirection)
      .pipe(untilDestroyed(this))
      .subscribe((sort: SortDirection) => {
        this.currentSort = sort;
        this.detect();
      });
  }

  private listenToCondensedViewChange(): void {
    this.store.select(selectTracingOverviewCondensedView)
      .pipe(untilDestroyed(this))
      .subscribe((condensedView: boolean) => {
        this.condensedView = condensedView;
        this.detect();
      });
  }

  sort(sort: SortDirection): void {
    if (sort === this.currentSort) {
      return;
    }
    const payload = this.currentSort === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<TracingOverviewSort>({ type: TRACING_OVERVIEW_SORT, payload });
  }

  toggleCondensedView(condensed: boolean): void {
    if (condensed === this.condensedView) {
      return;
    }
    this.store.dispatch<TracingOverviewToggleCondensedView>({ type: TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW });
  }
}
