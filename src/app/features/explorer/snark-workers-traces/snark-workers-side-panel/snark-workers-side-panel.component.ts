import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { selectSWTracesActiveRow } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { SW_TRACES_SET_ACTIVE_JOB, SWTracesSetActiveJob } from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { ExpandTracking } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';

@UntilDestroy()
@Component({
  selector: 'mina-snark-workers-side-panel',
  templateUrl: './snark-workers-side-panel.component.html',
  styleUrls: ['./snark-workers-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class SnarkWorkersSidePanelComponent extends ManualDetection implements OnInit {

  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };

  @Input() workers: string[];

  activeRow: SnarkWorkerTraceJob;
  expandTracking: ExpandTracking = {};

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectSWTracesActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: SnarkWorkerTraceJob) => {
        this.activeRow = row;
        this.detect();
      });
  }

  closeSidePanel() : void{
    this.store.dispatch<SWTracesSetActiveJob>({ type: SW_TRACES_SET_ACTIVE_JOB, payload: undefined });
  }
}
