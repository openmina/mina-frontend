import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswDashboardActiveNode } from '@dsw/dashboard/dsw-dashboard.state';
import { DswDashboardClose, DswDashboardGetNodes } from '@dsw/dashboard/dsw-dashboard.actions';
import { timer } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'mina-dsw-dashboard',
  templateUrl: './dsw-dashboard.component.html',
  styleUrls: ['./dsw-dashboard.component.scss'],
  host: { class: 'flex-column h-100' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswDashboardComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  constructor(public el: ElementRef) { super(); }

  ngOnInit(): void {
    timer(0, 10000).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.dispatch(DswDashboardGetNodes)
    });
    this.listenToSidePanelChange();
  }

  private listenToSidePanelChange(): void {
    this.select(selectDswDashboardActiveNode, node => {
      if (node && !this.isActiveRow) {
        this.isActiveRow = true;
        this.detect();
      } else if (!node && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  // private checkEarliestSlot(): void {
  //   let subscription: Subscription;
  //
  //   this.select(selectActiveNode, (node: MinaNode) => {
  //     subscription?.unsubscribe();
  //     subscription = timer(0, 20000)
  //       .pipe(untilDestroyed(this))
  //       .subscribe(() => {
  //         this.dispatch(DswActionsGetEarliestSlot);
  //       });
  //   });
  // }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswDashboardClose);
  }
}
