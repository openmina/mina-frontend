import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-dsw-dashboard-toolbar',
  templateUrl: './dsw-dashboard-toolbar.component.html',
  styleUrls: ['./dsw-dashboard-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row h-xl' },
})
export class DswDashboardToolbarComponent extends StoreDispatcher implements OnInit {

  ngOnInit(): void {
  }

}
