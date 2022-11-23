import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectAppSubMenus } from '@app/app.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'mina-submenu-tabs',
  templateUrl: './submenu-tabs.component.html',
  styleUrls: ['./submenu-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-40 flex-row flex-grow' },
})
export class SubmenuTabsComponent extends ManualDetection implements OnInit {

  subMenus: string[] = [];
  activeSubMenu: string;
  baseRoute: string;
  isMobile: boolean;

  constructor(private router: Router,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToSubMenuChange();
  }

  private listenToRouteChange(): void {
    const removeParams = (path: string): string => {
      if (path?.includes('?')) {
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
}
