import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectAppMenu } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { APP_CHANGE_MENU_COLLAPSING, APP_TOGGLE_MENU_OPENING, AppChangeMenuCollapsing, AppToggleMenuOpening } from '@app/app.actions';
import { CONFIG } from '@shared/constants/config';

class MenuItem {
  name: string;
  icon: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'Resources', icon: 'analytics' },
  { name: 'Network', icon: 'account_tree' },
  { name: 'Tracing', icon: 'grid_view' },
  { name: 'Web Node', icon: 'blur_circular' },
];

@UntilDestroy()
@Component({
  selector: 'mina-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends ManualDetection implements OnInit {

  readonly menuItems: MenuItem[] = this.allowedMenuItems;
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

  private get allowedMenuItems(): MenuItem[] {
    return MENU_ITEMS.filter((opt: MenuItem) => CONFIG.features.find(f => f === opt.name.toLowerCase().split(' ').join('-')));
  }

  toggleMenu(): void {
    if (this.menu.isMobile) {
      this.store.dispatch<AppToggleMenuOpening>({ type: APP_TOGGLE_MENU_OPENING });
      return;
    }
    this.store.dispatch<AppChangeMenuCollapsing>({ type: APP_CHANGE_MENU_COLLAPSING, payload: !this.menu.collapsed });
  }
}
