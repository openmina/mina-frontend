import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppMenu } from '@app/app.state';
import { TooltipService } from '@shared/services/tooltip.service';
import { LoadingService } from '@core/services/loading.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
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

  title: string;
  definiteLoading: LoadingEvent;
  isMobile: boolean;

  @ViewChild('loadingRef') private loadingRef: ElementRef<HTMLDivElement>;

  constructor(private router: Router,
              private store: Store<MinaState>,
              private loadingService: LoadingService,
              private tooltipService: TooltipService) { super(); }

  ngOnInit(): void {
    this.listenToTitleChange();
    this.listenToMenuChange();
    this.listenToLoading();
  }

  private listenToLoading(): void {
    const displayNone: string = 'd-none';
    const classList = this.loadingRef.nativeElement.classList;

    // this.loadingService.loadingSub$
    //   .pipe(delay(0))
    //   .subscribe((loading: boolean) => {
    //     if (!document.hidden) {
    //       loading ? classList.remove(displayNone) : classList.add(displayNone);
    //     } else {
    //       classList.add(displayNone);
    //     }
    //   });
    this.loadingService.countSub$
      .pipe(delay(0))
      .subscribe((count: number) => {
        if (count > 0) {
          classList.remove(displayNone);
        } else {
          classList.add(displayNone);
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

  toggleMenu(): void {
    this.store.dispatch<AppToggleMenuOpening>({ type: APP_TOGGLE_MENU_OPENING });
  }
}
