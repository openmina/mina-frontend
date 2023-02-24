import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { filter } from 'rxjs';
import { TracingBlockTrace } from '@shared/types/tracing/blocks/tracing-block-trace.type';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { TracingTraceGroup } from '@shared/types/tracing/blocks/tracing-trace-group.type';
import { selectTracingActiveTraceDetails, selectTracingActiveTraceGroups } from '@tracing/tracing-blocks/tracing-blocks.state';
import { TracingBlocksSelectRow } from '@tracing/tracing-blocks/tracing-blocks.actions';
import { BlockStructuredTraceComponent } from '@shared/components/block-structured-trace/block-structured-trace.component';
import { ExpandTracking } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-tracing-blocks-side-panel',
  templateUrl: './tracing-blocks-side-panel.component.html',
  styleUrls: ['./tracing-blocks-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class TracingBlocksSidePanelComponent extends StoreDispatcher implements OnInit {

  activeTraceMetadata: any | null;
  expandTracking: ExpandTracking = {};
  selectedTabIndex: number = 0;
  title: string;

  @ViewChild('traces', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private component: BlockStructuredTraceComponent;
  private activeTrace: TracingBlockTrace;
  private groups: TracingTraceGroup[];
  private expandedParents: string[] = [];

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await this.loadTracesComponent();
    this.listenToActiveTraceChange();
  }

  private async loadTracesComponent(): Promise<void> {
    await import('@shared/components/block-structured-trace/block-structured-trace.component').then(c => {
      this.component = this.containerRef.createComponent<BlockStructuredTraceComponent>(c.BlockStructuredTraceComponent).instance;
      this.component.expandedParents = this.expandedParents;
    });
    this.expandedParents = this.component.expandedParents;
  }

  private listenToActiveTraceChange(): void {
    this.select(selectTracingActiveTraceDetails, (trace: { activeTrace: TracingBlockTrace; activeTraceGroups: TracingTraceGroup[] }) => {
      this.activeTraceMetadata = trace.activeTrace.metadata;
      this.activeTrace = trace.activeTrace;
      this.title = trace.activeTrace.source + ' Transition ' + trace.activeTrace.height + ' - ' + trace.activeTrace.status;
      this.detect();
    }, filter(t => !!t.activeTrace));
    this.select(selectTracingActiveTraceGroups, (groups: TracingTraceGroup[]) => {
      this.groups = groups;
      this.setTracesInComponent();
    });
  }

  private setTracesInComponent(): void {
    this.component.checkpoints = this.groups[0]?.checkpoints;
    if (this.component.allExpanded) {
      this.component.expandAll();
    }
    this.component.detect();
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.TRACING, Routes.BLOCKS], { queryParamsHandling: 'merge' });
    this.dispatch(TracingBlocksSelectRow, undefined);
  }

  async selectTab(num: number): Promise<void> {
    this.selectedTabIndex = num;
    if (this.selectedTabIndex === 0) {
      this.detect();
      await this.loadTracesComponent();
      this.setTracesInComponent();
    }
  }
}
