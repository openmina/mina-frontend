import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@Component({
  selector: 'mina-tracing-overview-graph-tooltip',
  templateUrl: './tracing-overview-graph-tooltip.component.html',
  styleUrls: ['./tracing-overview-graph-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bg-surface-top pt-5 f-10 flex-column border-rad-6' },
})
export class TracingOverviewGraphTooltipComponent extends ManualDetection {

  @Input() xSteps: string[];
  @Input() activeXPointIndex: number;
  @Input() range: string;
  @Input() mean: number;
  @Input() max: number;
  @Input() calls: number;
  @Input() totalTime: number;

}
