import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';

@Component({
  selector: 'mina-dsw',
  templateUrl: './dsw.component.html',
  styleUrls: ['./dsw.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswComponent extends StoreDispatcher implements OnInit {

  ngOnInit(): void {
    this.dispatch(AppChangeSubMenus, [Routes.DASHBOARD, Routes.BOOTSTRAP, Routes.ACTIONS, Routes.LIVE, Routes.FRONTIER]);
  }
}
