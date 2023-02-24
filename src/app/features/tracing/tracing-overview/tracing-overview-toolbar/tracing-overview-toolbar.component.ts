import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { selectTracingOverviewCondensedView, selectTracingOverviewSortDirection } from '@tracing/tracing-overview/tracing-overview.state';
import { TracingOverviewSort, TracingOverviewToggleCondensedView } from '@tracing/tracing-overview/tracing-overview.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-tracing-overview-toolbar',
  templateUrl: './tracing-overview-toolbar.component.html',
  styleUrls: ['./tracing-overview-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center flex-between pl-12' },
})
export class TracingOverviewToolbarComponent extends StoreDispatcher implements OnInit {

  readonly SORT_DIRECTIONS = SortDirection;
  currentSort: SortDirection;
  condensedView: boolean;

  ngOnInit(): void {
    this.listenToSortChange();
    this.listenToCondensedViewChange();
  }

  private listenToSortChange(): void {
    this.select(selectTracingOverviewSortDirection, (sort: SortDirection) => {
      this.currentSort = sort;
      this.detect();
    });
  }

  private listenToCondensedViewChange(): void {
    this.select(selectTracingOverviewCondensedView, (condensedView: boolean) => {
      this.condensedView = condensedView;
      this.detect();
    });
  }

  sort(sort: SortDirection): void {
    if (sort === this.currentSort) {
      return;
    }
    const payload = this.currentSort === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(TracingOverviewSort, payload);
  }

  toggleCondensedView(condensed: boolean): void {
    if (condensed === this.condensedView) {
      return;
    }
    this.dispatch(TracingOverviewToggleCondensedView);
  }
}
