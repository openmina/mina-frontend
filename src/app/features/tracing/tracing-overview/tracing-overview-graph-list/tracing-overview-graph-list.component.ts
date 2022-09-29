import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TRACING_OVERVIEW_GET_CHECKPOINTS, TracingOverviewGetCheckpoints } from '@tracing/tracing-overview/tracing-overview.actions';
import { selectTracingOverviewCheckpoints, selectTracingOverviewCondensedView } from '@tracing/tracing-overview/tracing-overview.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectAppMenu } from '@app/app.state';
import { AppMenu } from '@shared/types/app/app-menu.type';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-overview-graph-list',
  templateUrl: './tracing-overview-graph-list.component.html',
  styleUrls: ['./tracing-overview-graph-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class TracingOverviewGraphListComponent extends ManualDetection implements OnInit {

  checkpoints: TracingOverviewCheckpoint[];
  condensedView: boolean;
  menuCollapsed: boolean;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<TracingOverviewGetCheckpoints>({ type: TRACING_OVERVIEW_GET_CHECKPOINTS });
    this.listenToCheckpointChanges();
    this.listenToCondensedViewChange();
    this.listenToMenuCollapsing();
  }

  private listenToCheckpointChanges(): void {
    this.store.select(selectTracingOverviewCheckpoints)
      .pipe(untilDestroyed(this))
      .subscribe((checkpoints: TracingOverviewCheckpoint[]) => {
        this.checkpoints = checkpoints;
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

  private listenToMenuCollapsing(): void {
    this.store.select(selectAppMenu)
      .pipe(untilDestroyed(this))
      .subscribe((menu: AppMenu) => {
        this.menuCollapsed = menu.collapsed;
        this.detect();
      })
  }
}
