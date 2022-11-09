import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CONFIG } from '@shared/constants/config';

type CanActivateReturnType = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable({
  providedIn: 'root',
})
export class FeatureGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CanActivateReturnType {
    if (CONFIG.features.some((name: string) => name === route.routeConfig.path)) {
      return true;
    }

    return this.router.navigateByUrl(CONFIG.features[0]);
  }

}
