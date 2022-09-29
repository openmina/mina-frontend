import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectAppMenu } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { APP_CHANGE_MENU_COLLAPSING, AppChangeMenuCollapsing } from '@app/app.actions';

@UntilDestroy()
@Component({
  selector: 'mina-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends ManualDetection implements OnInit {

  menu: AppMenu;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToCollapsingMenu();
  }

  private listenToCollapsingMenu(): void {
    this.store.select(selectAppMenu)
      .pipe(untilDestroyed(this))
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.detect();
      });
  }

  toggleMenu(): void {
    this.store.dispatch<AppChangeMenuCollapsing>({ type: APP_CHANGE_MENU_COLLAPSING, payload: !this.menu.collapsed });
  }
}
