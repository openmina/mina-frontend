import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectActiveNode } from '@app/app.state';
import { skip, timer } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';
import { DswLiveClose, DswLiveGetNodes, DswLiveInit } from '@dsw/live/dsw-live.actions';
import { selectDswLiveOpenSidePanel } from '@dsw/live/dsw-live.state';

@Component({
  selector: 'mina-dsw-live',
  templateUrl: './dsw-live.component.html',
  styleUrls: ['./dsw-live.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswLiveComponent extends StoreDispatcher implements OnInit, OnDestroy {

  openSidePanel: boolean;

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToNodeChange();
    this.listenToSidePanelOpening();
  }

  private listenToNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(DswLiveInit);
      this.dispatch(DswLiveGetNodes, { force: true });
    }, skip(1));

    timer(0, 2000)
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.dispatch(DswLiveGetNodes);
      });
  }

  private listenToSidePanelOpening(): void {
    this.select(selectDswLiveOpenSidePanel, (open: boolean) => {
      this.openSidePanel = !!open;
      this.detect();
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswLiveClose);
  }
}
