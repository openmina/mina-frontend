import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import { STRESSING_GET_WALLETS, STRESSING_INIT, StressingGetWallets, StressingInit } from '@stressing/stressing.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@Component({
  selector: 'mina-stressing',
  templateUrl: './stressing.component.html',
  styleUrls: ['./stressing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StressingComponent extends ManualDetection implements OnInit {

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.WALLETS, Routes.TRANSACTIONS] });
    this.store.dispatch<StressingGetWallets>({ type: STRESSING_GET_WALLETS });
    this.store.dispatch<StressingInit>({ type: STRESSING_INIT });
  }
}
