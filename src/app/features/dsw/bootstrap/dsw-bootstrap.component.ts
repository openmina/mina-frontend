import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapClose, DswBootstrapGetNodes, DswBootstrapInit } from '@dsw/bootstrap/dsw-bootstrap.actions';
import { selectDswBootstrapOpenSidePanel } from '@dsw/bootstrap/dsw-bootstrap.state';
import { skip, timer } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { DswDashboardGetNodes } from '@dsw/dashboard/dsw-dashboard.actions';
import { selectActiveNode } from '@app/app.state';

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
    this.listenToNodeChange();
    this.listenToSidePanelOpening();
  }

  private listenToNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(DswBootstrapGetNodes, { force: true });
    }, skip(1));

    timer(0, 10000)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.dispatch(DswBootstrapGetNodes);
      });
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
