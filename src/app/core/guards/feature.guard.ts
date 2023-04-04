import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { FeatureType, MinaNode } from '@shared/types/core/environment/mina-env.type';
import { selectActiveNode } from '@app/app.state';
import { getAvailableFeatures, getFirstFeature } from '@shared/constants/config';

type CanActivateReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
  providedIn: 'root',
})
export class FeatureGuard implements CanActivate {

  constructor(private router: Router,
              private store: Store<MinaState>) { }

  canActivate(route: ActivatedRouteSnapshot): CanActivateReturnType {
    return this.store.select(selectActiveNode)
      .pipe(
        switchMap((n: MinaNode | null) => {
          const node = n || {} as any;
          const hasThisFeature = getAvailableFeatures(node).some((f: FeatureType | string) => f === route.routeConfig.path);
          return hasThisFeature ? of(hasThisFeature) : this.router.navigateByUrl(getFirstFeature(node));
        }),
      );
  }

}
