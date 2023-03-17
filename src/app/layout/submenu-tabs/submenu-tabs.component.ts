import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { selectActiveNode } from '@app/app.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { removeParamsFromURL } from '@shared/helpers/router.helper';
import { combineLatest, debounceTime, filter } from 'rxjs';
import { getAvailableFeatures, getFeaturesConfig } from '@shared/constants/config';
import { FeatureType, MinaNode } from '@shared/types/core/environment/mina-env.type';

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
  activeNodeName: string;

  constructor(private router: Router,
              private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
  }

  private listenToRouteChange(): void {
    combineLatest([
      this.store.select(selectActiveNode)
        .pipe(filter(Boolean)),
      this.store.select(getMergedRoute)
        .pipe(filter(Boolean)),
    ])
      .pipe(
        untilDestroyed(this),
        debounceTime(100),
      )
      .subscribe((response: [MinaNode, MergedRoute]) => {
        const route = response[1];
        this.baseRoute = removeParamsFromURL(route.url.split('/')[1]);
        this.activeSubMenu = removeParamsFromURL(route.url.split('/')[2]);
        this.activeNodeName = route.queryParams['node'];

        this.setSubMenusOfActiveNodeForNewPage(response[0]);
        this.detect();
      });
  }

  private setSubMenusOfActiveNodeForNewPage(node: MinaNode): void {
    const feature = getAvailableFeatures(node).find((f: FeatureType) => f === this.baseRoute) as FeatureType;
    this.subMenus = getFeaturesConfig(node)[feature] || [];
  }
}
