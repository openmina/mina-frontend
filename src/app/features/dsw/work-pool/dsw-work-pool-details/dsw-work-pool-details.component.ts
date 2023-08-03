import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-dsw-work-pool-details',
  templateUrl: './dsw-work-pool-details.component.html',
  styleUrls: ['./dsw-work-pool-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsComponent extends StoreDispatcher implements OnInit {

  selectedTabIndex: number = 0;

  ngOnInit(): void {
  }

  selectTab(num: number): void {
    this.selectedTabIndex = num;
  }
}
