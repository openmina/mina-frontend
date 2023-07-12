import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapClose, DswBootstrapGetBlocks } from '@dsw/bootstrap/dsw-bootstrap.actions';
import { selectDswBootstrapOpenSidePanel } from '@dsw/bootstrap/dsw-bootstrap.state';

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
    this.dispatch(DswBootstrapGetBlocks);
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
