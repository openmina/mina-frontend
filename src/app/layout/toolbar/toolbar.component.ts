import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppMenu, selectAppSubMenus } from '@app/app.state';
import { TooltipService } from '@shared/services/tooltip.service';
import { LoadingService } from '@core/services/loading.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { LoadingEvent } from '@shared/types/core/loading/loading-event.type';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { APP_TOGGLE_MENU_OPENING, AppToggleMenuOpening } from '@app/app.actions';

@Component({
  selector: 'mina-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center border-bottom' },
})
export class ToolbarComponent extends ManualDetection implements OnInit {

  currentTheme: ThemeType;
  title: string;
  loading: boolean = false;
  definiteLoading: LoadingEvent;
  subMenus: string[] = [];
  activeSubMenu: string;
  baseRoute: string;
  isMobile: boolean;

  @ViewChild('loadingRef') private loadingRef: ElementRef<HTMLDivElement>;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private router: Router,
              private store: Store<MinaState>,
              private loadingService: LoadingService,
              private tooltipService: TooltipService) { super(); }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.listenToTitleChange();
    this.listenToRouteChange();
    this.listenToSubMenuChange();
    this.listenToMenuChange();
    this.listenToLoading();
  }

  private listenToLoading(): void {
    const clazz: string = 'd-none';
    const classList = this.loadingRef.nativeElement.classList;

    this.loadingService.loadingSub$
      .pipe(delay(0))
      .subscribe((loading: boolean) => {
        if (!document.hidden) {
          loading ? classList.remove(clazz) : classList.add(clazz);
        } else {
          classList.add(clazz);
        }
      });

    this.loadingService.progressLoadingSub$
      .pipe(delay(0))
      .subscribe((event: LoadingEvent) => {
        this.definiteLoading = event;
        if (event.percentage === 100) {
          this.loadingService.progressLoadingSub$.next({ percentage: 0 });
          return;
        } else if (event.percentage === 0) {
          this.definiteLoading = null;
        }
        this.detect();
      });
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(ThemeType.LIGHT) ? ThemeType.DARK : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken: string = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  private listenToRouteChange(): void {
    const removeParams = (path: string): string => {
      if (path.includes('?')) {
        return path.split('?')[0];
      }
      return path;
    };
    this.store.select(getMergedRoute)
      .subscribe((route: MergedRoute) => {
        this.baseRoute = removeParams(route.url.split('/')[1]);
        this.activeSubMenu = removeParams(route.url.split('/')[2]);
        this.detect();
      });
  }

  private listenToSubMenuChange(): void {
    this.store.select(selectAppSubMenus)
      .subscribe((subMenus: string[]) => {
        this.subMenus = subMenus;
        this.detect();
      });
  }

  private listenToMenuChange(): void {
    this.store.select(selectAppMenu)
      .pipe(filter(menu => menu.isMobile !== this.isMobile))
      .subscribe((menu: AppMenu) => {
        this.isMobile = menu.isMobile;
        this.detect();
      });
  }

  private listenToTitleChange(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          while (route!.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data[Object.getOwnPropertySymbols(route.snapshot.data)[0]];
        }),
      )
      .subscribe((title: string) => {
        if (title) {
          this.title = title.split('- ')[1];
          this.detect();
        }
      });
  }

  toggleTooltips(): void {
    this.tooltipService.toggleTooltips();
  }

  // navigateToSubMenu(subMenu: string): void {
  //   this.router.navigate([this.baseRoute, subMenu]);
  // }
  toggleMenu(): void {
    this.store.dispatch<AppToggleMenuOpening>({ type: APP_TOGGLE_MENU_OPENING });
  }
}
