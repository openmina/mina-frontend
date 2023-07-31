import { ChangeDetectionStrategy, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswDashboardActiveNode } from '@dsw/dashboard/dsw-dashboard.state';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { DswDashboardSetActiveNode } from '@dsw/dashboard/dsw-dashboard.actions';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { filter } from 'rxjs';

@Component({
  selector: 'mina-dsw-dashboard-side-panel',
  templateUrl: './dsw-dashboard-side-panel.component.html',
  styleUrls: ['./dsw-dashboard-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswDashboardSidePanelComponent extends StoreDispatcher implements OnInit {

  node: DswDashboardNode;

  @ViewChild('bestTipRef') private bestTipRef: ElementRef<HTMLSpanElement>;

  private interval: any;
  private secondsPassed: number = 0;
  private timeReference: number = 0;

  constructor(private router: Router,
              private zone: NgZone) { super(); }

  ngOnInit(): void {
    this.createTimer();
    this.listenToActiveDswDashboardNode();
  }

  private listenToActiveDswDashboardNode(): void {
    this.select(selectDswDashboardActiveNode, (node: DswDashboardNode) => {
      this.node = node;
      this.timeReference = node.bestTipReceivedTimestamp;
      this.secondsPassed = (Date.now() - this.timeReference) / 1000;
      this.updateTimeInView();
      this.detect();
    }, filter(node => !!node));
  }

  closeSidePanel(): void {
    this.dispatch(DswDashboardSetActiveNode, undefined);
    this.router.navigate([Routes.SNARK_WORKER, Routes.DASHBOARD], { queryParamsHandling: 'merge' });
  }

  private createTimer(): void {
    this.zone.run(() => {
      clearInterval(this.interval);
      this.interval = setInterval(() => this.updateTimeInView(), 1000);
    });
  }

  private updateTimeInView(): void {
    const next = this.secondsPassed + 1;
    this.secondsPassed++;
    this.bestTipRef.nativeElement.innerText = DswDashboardSidePanelComponent.getFormattedTimeToDisplay(next);
  }

  private static getFormattedTimeToDisplay(next: number): string {
    const twoDigit = (val: number) => val < 10 ? `0${val}` : val;
    let time = '';
    if (next <= 3599) {
      const min = Math.floor(next / 60);
      const sec = Math.floor(next % 60);
      time += twoDigit(min) + 'm ' + twoDigit(sec) + 's';
    } else if (next <= 86399) {
      const hour = Math.floor(next / 3600);
      const min = Math.floor(next / 60 % 60);
      time += twoDigit(hour) + 'h ' + twoDigit(min) + 'm';
    } else {
      const day = Math.floor(next / 86400);
      const hour = Math.floor(next / 3600 % 24);
      time += twoDigit(day) + 'd ' + twoDigit(hour) + 'h';
    }
    return time + ' ago';
  }
}
