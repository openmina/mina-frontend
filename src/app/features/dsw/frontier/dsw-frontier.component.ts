import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswFrontierClose, DswFrontierGetLogs } from '@dsw/frontier/dsw-frontier.actions';
import { selectDswFrontierActiveLog } from '@dsw/frontier/dsw-frontier.state';

@Component({
  selector: 'mina-dsw-frontier',
  templateUrl: './dsw-frontier.component.html',
  styleUrls: ['./dsw-frontier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswFrontierComponent extends StoreDispatcher implements OnInit {

  isActiveRow: boolean;

  constructor(public el: ElementRef) { super(); }

  ngOnInit(): void {
    this.dispatch(DswFrontierGetLogs);
    this.listenToSidePanelChange();
  }

  private listenToSidePanelChange(): void {
    this.select(selectDswFrontierActiveLog, log => {
      if (log && !this.isActiveRow) {
        this.isActiveRow = true;
        this.detect();
      } else if (!log && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswFrontierClose);
  }
}
