import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  AGGREGATOR_CLOSE,
  AGGREGATOR_GET_EARLIEST_BLOCK,
  AGGREGATOR_INIT,
  AGGREGATOR_SET_ACTIVE_BLOCK,
  AggregatorClose,
  AggregatorGetEarliestBlock,
  AggregatorInit,
  AggregatorSetActiveBlock,
} from '@dashboard/aggregator/aggregator.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { selectAppNodeStatus } from '@app/app.state';
import { filter, merge, take, timer } from 'rxjs';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { HorizontalResizableContainerOldComponent } from '../../../shared/components/horizontal-resizable-container-old/horizontal-resizable-container-old.component';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { DashboardTableComponent } from '@dashboard/aggregator/dashboard-table/dashboard-table.component';
import { selectAggregatorSidePanelOpen } from '@dashboard/aggregator/aggregator.state';

@UntilDestroy()
@Component({
  selector: 'mina-aggregator',
  templateUrl: './aggregator.component.html',
  styleUrls: ['./aggregator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregatorComponent extends ManualDetection implements OnInit, AfterViewInit, OnDestroy {

  isSidePanelOpen: boolean;

  private blockHeight: number;
  private removedClass: boolean;

  @ViewChild(DashboardTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerOldComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToActiveBlockChangeFromNode();
  }

  ngAfterViewInit(): void {
    this.listenToSidePanelOpeningChange();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(
        untilDestroyed(this),
        take(1),
        filter(route => route.params['height']),
      )
      .subscribe((route: MergedRoute) => {
        this.blockHeight = Number(route.params['height']);
        this.store.dispatch<AggregatorSetActiveBlock>({
          type: AGGREGATOR_SET_ACTIVE_BLOCK,
          payload: { height: this.blockHeight },
        });
        this.store.dispatch<AggregatorInit>({ type: AGGREGATOR_INIT });
      });
  }

  private listenToActiveBlockChangeFromNode(): void {
    merge(
      this.store.select(selectAppNodeStatus)
        .pipe(
          untilDestroyed(this),
          filter(Boolean),
          filter((node: NodeStatus) => node.status !== AppNodeStatusTypes.CONNECTING),
        ),
      timer(0, 10000),
    )
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.store.dispatch<AggregatorGetEarliestBlock>({ type: AGGREGATOR_GET_EARLIEST_BLOCK });
      });
  }

  private listenToSidePanelOpeningChange(): void {
    this.store.select(selectAggregatorSidePanelOpen)
      .pipe(untilDestroyed(this))
      .subscribe((open: boolean) => {
        this.isSidePanelOpen = open;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<AggregatorClose>({ type: AGGREGATOR_CLOSE });
  }
}
