import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswWorkPoolActiveWorkPoolDetail } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPoolDetail } from '@shared/types/dsw/work-pool/work-pool-detail.type';
import { Router } from '@angular/router';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';

@Component({
  selector: 'mina-dsw-work-pool-details',
  templateUrl: './dsw-work-pool-details.component.html',
  styleUrls: ['./dsw-work-pool-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsComponent extends StoreDispatcher implements OnInit {

  accounts: { job: number, first: boolean, data: any }[];
  selectedTabIndex: number;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPoolDetail, (detail: WorkPoolDetail) => {
      this.accounts = this.getAccounts(detail);
      this.detect();
    });
    this.listenToTabFromRoute();
  }

  selectTab(num: number): void {
    this.selectedTabIndex = num;
    this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { tab: num },
    });
  }

  private getAccounts(detail: WorkPoolDetail): { job: number, first: boolean, data: any }[] {
    const accounts: { job: number, first: boolean, data: any }[] = [];
    const getAccountsRecursively = (nodes: any[], job: number, first: boolean): void => {
      for (const node of nodes) {
        if (node.Account) {
          accounts.push({ job, first, data: node.Account });
        }
        if (node.Node && Array.isArray(node.Node)) {
          getAccountsRecursively(node.Node, job, first);
        }
      }
    };
    try {
      const jobs = detail.job[Object.keys(detail.job)[0]];
      jobs.forEach((job: any, idx: number) => {
        try {
          const tree = job.Base.first_pass_ledger_witness.tree;
          getAccountsRecursively(tree.Node, idx, true);
        } catch (e) {
        }
        try {
          const tree2 = job.Base.second_pass_ledger_witness.tree;
          getAccountsRecursively(tree2.Node, idx, false);
        } catch (e) {
        }
      });
      return accounts;
    } catch (e) {
      return [];
    }
  }

  private listenToTabFromRoute(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.queryParams['tab']) {
        this.selectedTabIndex = Number(route.queryParams['tab']);
      } else {
        this.selectTab(0);
      }
    });
  }
}
