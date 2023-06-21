import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'mina-flame-time-graph-tooltip',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './flame-time-graph-tooltip.component.html',
  styleUrls: ['./flame-time-graph-tooltip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush ,
  host: { class: 'bg-surface-top pt-5 f-10 flex-column border-rad-6' },
})
export class FlameTimeGraphTooltipComponent extends ManualDetection {

  @Input() xSteps: string[];
  @Input() activeXPointIndex: number;
  @Input() range: string;
  @Input() mean: number;
  @Input() max: number;
  @Input() calls: number;
  @Input() totalTime: number;

}
