import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { selectActiveNode } from '@app/app.state';

type CanActivateReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
  providedIn: 'root',
})
export class FeatureGuard implements CanActivate {

  constructor(private router: Router,
              private store: Store<MinaState>) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CanActivateReturnType {
    return this.store.select(selectActiveNode)
      .pipe(
        filter(Boolean),
        switchMap((node: MinaNode) => {
          return of(node?.features.some((name: string) => name === route.routeConfig.path))
            || this.router.navigateByUrl(node?.features[0]);
        }),
      );
  }

}
