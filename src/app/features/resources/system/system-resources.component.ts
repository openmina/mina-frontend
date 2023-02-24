import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SystemResourcesService } from './system-resources.service';
import { SystemResourcesClose, SystemResourcesGetResources, SystemResourcesSetActiveTime } from '@resources/system/system-resources.actions';
import { selectActiveNode } from '@app/app.state';
import { take } from 'rxjs';
import { AppChangeSubMenus } from '@app/app.actions';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { Router } from '@angular/router';
import { MergedRoute } from '@shared/router/merged-route';
import { Routes } from '@shared/enums/routes.enum';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-system-resources',
  templateUrl: './system-resources.component.html',
  styleUrls: ['./system-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemResourcesComponent extends StoreDispatcher implements OnInit, OnDestroy {

  constructor(private systemResourcesService: SystemResourcesService,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.dispatch(AppChangeSubMenus, [Routes.SYSTEM]);
    this.listenToNodeChanging();
    this.listenToRouteChange();
  }

  private listenToNodeChanging(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(SystemResourcesGetResources);
    });
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      this.dispatch(SystemResourcesSetActiveTime, {
        timestamp: Number(route.queryParams['timestamp']),
        resource: this.getResource(route.queryParams['resource'] || 'cpu'),
      });

      if (!route.queryParams['resource']) {
        this.router.navigate(['resources', 'system'], {
          queryParams: { resource: 'cpu' },
          queryParamsHandling: 'merge',
        });
      }
    }, take(1));
  }

  private getResource(queryParam: string): string {
    if (queryParam.includes('storage')) {
      return 'io';
    } else if (queryParam.includes('network')) {
      return 'network';
    }
    return queryParam;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(SystemResourcesClose);
  }
}
