import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapClose, DswBootstrapGetNodes, DswBootstrapInit } from '@dsw/bootstrap/dsw-bootstrap.actions';
import { selectDswBootstrapOpenSidePanel } from '@dsw/bootstrap/dsw-bootstrap.state';
import { timer } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { DswDashboardGetNodes } from '@dsw/dashboard/dsw-dashboard.actions';

@Component({
  selector: 'mina-dsw-bootstrap',
  templateUrl: './dsw-bootstrap.component.html',
  styleUrls: ['./dsw-bootstrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswBootstrapComponent extends StoreDispatcher implements OnInit, OnDestroy {

  openSidePanel: boolean;

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.dispatch(DswBootstrapInit);
    timer(0, 10000).pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.dispatch(DswBootstrapGetNodes);
    });
    this.listenToSidePanelOpening();
  }

  private listenToSidePanelOpening(): void {
    this.select(selectDswBootstrapOpenSidePanel, (open: boolean) => {
      this.openSidePanel = !!open;
      this.detect();
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswBootstrapClose);
  }
}
