import { ChangeDetectionStrategy, Component, ComponentRef, EventEmitter, Input } from '@angular/core';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TracingOverviewGraphTooltipComponent } from '@tracing/tracing-overview/tracing-overview-graph-tooltip/tracing-overview-graph-tooltip.component';
import { TracingOverviewCheckpointColumn } from '@shared/types/tracing/overview/tracing-overview-checkpoint-column.type';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { take } from 'rxjs';


const Y_STEPS = ['1000s', '100s', '10s', '1s', '100ms', '10ms', '1ms', '100μs', '10μs'];
const X_STEPS = ['1μs', '10μs', '100μs', '1ms', '10ms', '100ms', '1s', '10s', '100s'];
const RANGES = ['1μs - 10μs', '10μs - 100μs', '100μs - 1ms', '1ms - 10ms', '10ms - 100ms', '100ms - 1s', '1s - 10s', '10s - 100s', '> 100s'];

@Component({
  selector: 'mina-tracing-overview-graph',
  templateUrl: './tracing-overview-graph.component.html',
  styleUrls: ['./tracing-overview-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracingOverviewGraphComponent extends ManualDetection {

  @Input() checkpoint: TracingOverviewCheckpoint;
  @Input() condensedView: boolean;
  @Input() xSteps: string[] = X_STEPS;
  @Input() ySteps: string[] = Y_STEPS;
  @Input() visible: boolean = true;
  @Input() menuCollapsed: boolean;

  readonly onClickOutside: EventEmitter<void> = new EventEmitter<void>();

  private hoveredColumn: TracingOverviewCheckpointColumn;
  private overlayRef: OverlayRef;
  private tooltipComponent: ComponentRef<TracingOverviewGraphTooltipComponent>;
  private expandedGraphComponent: ComponentRef<TracingOverviewGraphComponent>;

  constructor(private overlay: Overlay) { super(); }

  onColumnHover(column: TracingOverviewCheckpointColumn): void {
    this.hoveredColumn = column;
    this.tooltipComponent.instance.xSteps = this.xSteps;
    this.tooltipComponent.instance.range = RANGES[this.checkpoint.columns.indexOf(column)];
    this.tooltipComponent.instance.activeXPointIndex = this.checkpoint.columns.indexOf(column);
    this.tooltipComponent.instance.mean = column.meanTime;
    this.tooltipComponent.instance.max = column.maxTime;
    this.tooltipComponent.instance.calls = column.count;
    this.tooltipComponent.instance.totalTime = column.totalTime;
    this.tooltipComponent.instance.detect();
  }

  attachGraphTooltip(xStepsRef: HTMLDivElement): void {
    if (this.overlayRef?.hasAttached()) {
      this.detachOverlay();
      return;
    }
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(xStepsRef)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: -3,
          offsetY: 3,
        }]),
    });

    const portal = new ComponentPortal(TracingOverviewGraphTooltipComponent);
    this.tooltipComponent = this.overlayRef.attach<TracingOverviewGraphTooltipComponent>(portal);
  }

  detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  expandCondensedGraph(graphRef: HTMLDivElement, event: MouseEvent): void {
    if (!this.condensedView) {
      return;
    }
    if (this.overlayRef?.hasAttached()) {
      this.detachOverlay();
      return;
    }
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: `tracing-overview-overlay-${this.menuCollapsed ? 'big' : 'small'}`,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(graphRef)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
        }]),
    });
    event.stopPropagation();

    const portal = new ComponentPortal(TracingOverviewGraphComponent);
    this.expandedGraphComponent = this.overlayRef.attach<TracingOverviewGraphComponent>(portal);
    this.expandedGraphComponent.instance.checkpoint = this.checkpoint;
    this.expandedGraphComponent.instance.xSteps = this.xSteps;
    this.expandedGraphComponent.instance.ySteps = this.ySteps;
    this.expandedGraphComponent.instance.visible = false;
    this.expandedGraphComponent.instance.detect();
    this.expandedGraphComponent.instance.onClickOutside
      .pipe(take(1))
      .subscribe(() => this.detachOverlay());

    setTimeout(() => { // for animation
      this.expandedGraphComponent.instance.visible = true;
      this.expandedGraphComponent.instance.detect();
    });
  }

  onOutsideClick(): void {
    this.onClickOutside.emit();
  }
}
