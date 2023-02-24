import { ChangeDetectionStrategy, Component, EventEmitter } from '@angular/core';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { TracingTraceCheckpoint } from '@shared/types/tracing/blocks/tracing-trace-checkpoint.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SharedModule } from '@shared/shared.module';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'mina-block-structured-trace',
  templateUrl: './block-structured-trace.component.html',
  styleUrls: ['./block-structured-trace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class BlockStructuredTraceComponent extends ManualDetection {

  readonly timeColorScheme: SecDurationConfig = { red: 1, orange: 0.3, yellow: 0.1, color: true };

  title: string;
  checkpoints: TracingTraceCheckpoint[] = [];
  expandedParents: string[] = [];
  allExpanded: boolean;

  toggleExpanding(checkpoint: TracingTraceGroup | TracingTraceCheckpoint): void {
    if (!checkpoint.checkpoints.length) {
      return;
    }
    const index = this.expandedParents.indexOf(checkpoint.title);
    if (index !== -1) {
      this.expandedParents.splice(index, 1);
    } else {
      this.expandedParents.push(checkpoint.title);
    }
  }

  expandAll(): void {
    this.allExpanded = true;
    this.collapseAll();
    this.expandRecursively(this.checkpoints);
  }

  private expandRecursively(checkpoints: TracingTraceCheckpoint[]): void {
    checkpoints.forEach((checkpoint: TracingTraceCheckpoint) => {
      if (checkpoint.checkpoints.length) {
        this.expandedParents.push(checkpoint.title);
      }
      this.expandRecursively(checkpoint.checkpoints);
    });
  };

  collapseAll(): void {
    this.expandedParents = [];
    this.allExpanded = false;
  }
}
