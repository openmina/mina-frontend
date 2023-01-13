import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { APP_TOGGLE_MENU_OPENING, APP_TOGGLE_MOBILE, AppToggleMenuOpening, AppToggleMobile } from '@app/app.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { selectAppMenu } from '@app/app.state';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MIN_WIDTH_700 } from '@shared/constants/breakpoint-observer';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ManualDetection implements OnInit {

  menu: AppMenu = {} as AppMenu;
  currentUrl: string;

  constructor(private store: Store<MinaState>,
              private router: Router,
              private breakpointObserver: BreakpointObserver) {
    super();
    if ((window as any).Cypress) {
      (window as any).store = store;
    }
  }

  ngOnInit(): void {
    this.listenToCollapsingMenu();
    this.listenToWindowResizing();
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd),
      )
      .subscribe((evt: NavigationEnd) => {
        this.currentUrl = evt.url.split('/')[1];
        this.detect();
      });
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

  toggleMenu(): void {
    this.store.dispatch<AppToggleMenuOpening>({ type: APP_TOGGLE_MENU_OPENING });
  }
}
