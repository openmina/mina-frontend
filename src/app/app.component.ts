import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_INIT, APP_TOGGLE_MOBILE, AppInit, AppToggleMobile } from '@app/app.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { selectAppMenu } from '@app/app.state';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ManualDetection implements OnInit {

  menu: AppMenu = {} as AppMenu;

  constructor(private store: Store<MinaState>,
              private breakpointObserver: BreakpointObserver) {
    super();
    if ((window as any).Cypress) {
      (window as any).store = store;
    }
  }

  ngOnInit(): void {
    this.store.dispatch<AppInit>({ type: APP_INIT });
    this.listenToCollapsingMenu();
    this.listenToWindowResizing();
  }

  private listenToCollapsingMenu(): void {
    this.store.select(selectAppMenu)
      .subscribe((menu: AppMenu) => {
        this.menu = menu;
        this.detect();
      });
  }

  private listenToWindowResizing(): void {
    this.breakpointObserver
      .observe(MIN_WIDTH_700)
      .subscribe((bs: BreakpointState) => {
        this.store.dispatch<AppToggleMobile>({ type: APP_TOGGLE_MOBILE, payload: { isMobile: !bs.matches } });
      });
  }
}
