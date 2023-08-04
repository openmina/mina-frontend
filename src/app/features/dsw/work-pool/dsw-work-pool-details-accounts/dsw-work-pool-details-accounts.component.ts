import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { toggleItem } from '@shared/helpers/array.helper';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { Router } from '@angular/router';

@Component({
  selector: 'mina-dsw-work-pool-details-accounts',
  templateUrl: './dsw-work-pool-details-accounts.component.html',
  styleUrls: ['./dsw-work-pool-details-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsAccountsComponent extends StoreDispatcher implements OnInit {

  @Input() accounts: { job: number, first: boolean, data: any }[];

  opened: number[] = [];

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToTabFromRoute();
  }

  toggleOpening(index: number): void {
    this.opened = toggleItem(this.opened, index);
    if (this.opened.includes(index)) {
      this.routeToAccount(index);
    } else if (this.opened.length === 0) {
      this.routeToAccount(undefined);
    }
  }

  private routeToAccount(idx: number): void {
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { account: idx },
    });
  }

  private listenToTabFromRoute(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.queryParams['account']) {
        const account = Number(route.queryParams['account']);
        if (!this.opened.includes(account)) {
          this.toggleOpening(account);
        }
      }
    });
  }
}
