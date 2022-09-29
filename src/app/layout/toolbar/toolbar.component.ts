import { ChangeDetectionStrategy, Component, Inject, NgZone, OnInit } from '@angular/core';
import { ThemeType } from '@shared/types/core/theme/theme-types.type';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, delay, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppLastBlockLevelAndStatus, selectAppSubMenus } from '@app/app.state';
import { AppNodeStatus } from '@shared/types/app/app-node-status.type';
import { TooltipService } from '@shared/services/tooltip.service';
import { LoadingService } from '@core/services/loading.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';

const TOOLTIP_MESSAGES: { [p: string]: string } = {
  [AppNodeStatus.OFFLINE.toLowerCase()]: 'Is when the node has not received any messages for a while',
  [AppNodeStatus.CONNECTING.toLowerCase()]: 'Is when the node has not received any messages for a while',
  [AppNodeStatus.LISTENING.toLowerCase()]: 'Is when the node has already connected to some peers and is waiting to receive messages from them',
  [AppNodeStatus.BOOTSTRAP.toLowerCase()]: 'Means that the node has not yet completed the download of the epoch ledgers',
  [AppNodeStatus.CATCHUP.toLowerCase()]: 'Means that there are pending catchup jobs',
  [AppNodeStatus.SYNCED.toLowerCase()]: 'Online, up to date, with no pending catchup jobs.',
};

@Component({
  selector: 'mina-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center border-bottom' },
})
export class ToolbarComponent extends ManualDetection implements OnInit {

  readonly elapsedTime$: BehaviorSubject<string> = new BehaviorSubject<string>('0s');
  readonly statuses = AppNodeStatus;

  currentTheme: ThemeType;
  title: string;
  blockLevel: number;
  status: string = AppNodeStatus.CONNECTING.toLowerCase();
  timeIsPresent: boolean;
  tooltip: string = TOOLTIP_MESSAGES[this.status];
  loading: boolean = false;
  subMenus: string[] = [];
  activeSubMenu: string;

  private interval: number;
  private secondsPassed: number = 0;
  private timeReference: number = 0;
  private baseRoute: string;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              private router: Router,
              private zone: NgZone,
              private store: Store<MinaState>,
              private loadingService: LoadingService,
              private tooltipService: TooltipService) { super(); }

  ngOnInit(): void {
    this.currentTheme = localStorage.getItem('theme') as ThemeType;
    this.createTimer();
    this.listenToTitleChange();
    this.listenToLastBlockChange();
    this.listenToRouteChange();
    this.listenToSubMenuChange();
    this.listenToLoading();
  }

  private listenToLoading(): void {
    this.loadingService.loadingSub$
      .pipe(delay(0))
      .subscribe((loading: boolean) => {
        this.loading = loading;
        this.detect();
      });
  }

  changeTheme(): void {
    const theme: ThemeType = this.document.body.classList.contains(ThemeType.LIGHT) ? ThemeType.DARK : ThemeType.LIGHT;
    this.currentTheme = theme;
    const transitionToken = 'theme-transition';

    this.document.body.classList.add(transitionToken);
    this.document.body.classList.remove(ThemeType.DARK, ThemeType.LIGHT);
    this.document.body.classList.add(theme);

    localStorage.setItem('theme', theme);
    setTimeout(() => this.document.body.classList.remove(transitionToken), 700);
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .subscribe((route: MergedRoute) => {
        this.baseRoute = route.url.split('/')[1];
        this.activeSubMenu = route.url.split('/')[2];
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

  private listenToLastBlockChange(): void {
    this.store.select(selectAppLastBlockLevelAndStatus)
      .pipe(
        filter(data => this.blockLevel !== data.level
          || this.status.toLowerCase() !== data.status.toLowerCase()
          || this.timeReference !== data.timestamp,
        ),
      )
      .subscribe((data: { level: number, status: AppNodeStatus, timestamp: number }) => {
        this.timeIsPresent = !!data.timestamp;
        if (this.blockLevel !== data.level) {
          this.timeReference = data.timestamp;
          this.secondsPassed = (Date.now() - this.timeReference) / 1000;
          this.elapsedTime$.next(ToolbarComponent.getFormattedTimeToDisplay(this.secondsPassed));
        }

        this.blockLevel = data.level;
        this.status = data.status.toLowerCase();
        this.tooltip = TOOLTIP_MESSAGES[this.status];
        this.detect();
      });
  }

  private createTimer(): void {
    this.zone.run(() => {
      this.interval = setInterval(() => {
        const next = this.secondsPassed + 1;
        const time = ToolbarComponent.getFormattedTimeToDisplay(next);

        this.secondsPassed++;
        this.elapsedTime$.next(time);
      }, 1000);
    });
  }

  private static getFormattedTimeToDisplay(next: number): string {
    const twoDigit = (val: number) => val < 10 ? `0${val}` : val;
    let time = '';
    if (next <= 3599) {
      const min = Math.floor(next / 60);
      const sec = Math.floor(next % 60);
      time += twoDigit(min) + 'm ' + twoDigit(sec) + 's';
    } else {
      const hour = Math.floor(next / 3600);
      const min = Math.floor(next / 60 % 60);
      time += twoDigit(hour) + 'h ' + twoDigit(min) + 'm';
    }
    return time;
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
    // this.tooltipService.toggleTooltips();
  }

  navigateToSubMenu(subMenu: string): void {
    this.router.navigate([this.baseRoute, subMenu]);
  }
}
