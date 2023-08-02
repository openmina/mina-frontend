import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { timer } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { DswDashboardClose, DswDashboardGetNodes } from '@dsw/dashboard/dsw-dashboard.actions';
import { selectDswDashboardActiveNode } from '@dsw/dashboard/dsw-dashboard.state';
import { DswWorkPoolClose, DswWorkPoolGetWorkPool } from '@dsw/work-pool/dsw-work-pool.actions';
import { selectDswWorkPoolActiveWorkPool } from '@dsw/work-pool/dsw-work-pool.state';

@Component({
  selector: 'mina-dsw-work-pool',
  templateUrl: './dsw-work-pool.component.html',
  styleUrls: ['./dsw-work-pool.component.scss'],
  host: { class: 'flex-column h-100' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  constructor(public el: ElementRef) { super(); }

  ngOnInit(): void {
    this.dispatch(DswWorkPoolGetWorkPool);
    this.listenToSidePanelChange();
  }

  private listenToSidePanelChange(): void {
    this.select(selectDswWorkPoolActiveWorkPool, node => {
      if (node && !this.isActiveRow) {
        this.isActiveRow = true;
        this.detect();
      } else if (!node && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswWorkPoolClose);
  }
}
