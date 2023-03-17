import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppSubMenus } from '@app/app.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy } from '@ngneat/until-destroy';
import { removeParamsFromURL } from '@shared/helpers/router.helper';
import { filter } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-submenu-tabs',
  templateUrl: './submenu-tabs.component.html',
  styleUrls: ['./submenu-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-xl flex-row flex-grow align-center' },
})
export class SubmenuTabsComponent extends ManualDetection implements OnInit {

  subMenus: string[] = [];
  activeSubMenu: string;
  baseRoute: string;
  isMobile: boolean;
  activeNode: string;

  constructor(private router: Router,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToSubMenuChange();
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(filter(Boolean))
      .subscribe((route: MergedRoute) => {
        this.baseRoute = removeParamsFromURL(route.url.split('/')[1]);
        this.activeSubMenu = removeParamsFromURL(route.url.split('/')[2]);
        this.activeNode = route.queryParams['node'];
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
}
