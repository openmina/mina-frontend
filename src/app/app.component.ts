import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_INIT, AppInit } from '@app/app.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { selectAppMenu } from '@app/app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ManualDetection implements OnInit {

  menu: AppMenu;

  constructor(private store: Store<MinaState>) {
    super();
    if ((window as any).Cypress) {
      (window as any).store = store;
    }
  }

  ngOnInit(): void {
    this.store.dispatch<AppInit>({ type: APP_INIT });
    this.listenToCollapsingMenu();
  }

  private listenToCollapsingMenu(): void {
    this.store.select(selectAppMenu)
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.detect();
      });
  }
}
