import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy } from '@ngneat/until-destroy';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-tracing',
  templateUrl: './tracing.component.html',
  styleUrls: ['./tracing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class TracingComponent implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.OVERVIEW, Routes.BLOCKS] });
  }

  ngOnDestroy(): void {
  }
}
