import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import {
  STRESSING_CLOSE,
  STRESSING_GET_TRANSACTIONS,
  STRESSING_GET_WALLETS,
  StressingClose,
  StressingGetTransactions,
  StressingGetWallets,
} from '@stressing/stressing.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectActiveNode } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, skip } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-stressing',
  templateUrl: './stressing.component.html',
  styleUrls: ['./stressing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StressingComponent extends ManualDetection implements OnInit, OnDestroy {

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [Routes.WALLETS, Routes.TRANSACTIONS] });
    this.store.dispatch<StressingGetWallets>({ type: STRESSING_GET_WALLETS });
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.store.dispatch<StressingGetTransactions>({ type: STRESSING_GET_TRANSACTIONS });
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch<StressingClose>({ type: STRESSING_CLOSE });
  }
}
