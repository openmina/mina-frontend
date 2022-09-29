import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { TRACING_OVERVIEW_CLOSE, TracingOverviewClose } from '@tracing/tracing-overview/tracing-overview.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-tracing-overview',
  templateUrl: './tracing-overview.component.html',
  styleUrls: ['./tracing-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class TracingOverviewComponent extends ManualDetection implements OnInit, OnDestroy {

  checkpoints: TracingOverviewCheckpoint[];

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.store.dispatch<TracingOverviewClose>({ type: TRACING_OVERVIEW_CLOSE });
  }
}
