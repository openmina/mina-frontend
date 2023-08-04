import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswWorkPoolActiveWorkPoolDetail } from '@dsw/work-pool/dsw-work-pool.state';
import { WorkPoolDetail } from '@shared/types/dsw/work-pool/work-pool-detail.type';

@Component({
  selector: 'mina-dsw-work-pool-details',
  templateUrl: './dsw-work-pool-details.component.html',
  styleUrls: ['./dsw-work-pool-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswWorkPoolDetailsComponent extends StoreDispatcher implements OnInit {

  accounts: any[];
  selectedTabIndex: number = 0;

  ngOnInit(): void {
    this.select(selectDswWorkPoolActiveWorkPoolDetail, (detail: WorkPoolDetail) => {
      this.accounts = this.getAccounts(detail);
      this.detect();
    });
  }

  selectTab(num: number): void {
    this.selectedTabIndex = num;
  }

  private getAccounts(detail: WorkPoolDetail): any[] {
    const accounts: any[] = [];
    const getAccountsRecursively = (nodes: any[]): void => {
      for (const node of nodes) {
        if (node.Account) {
          accounts.push(node.Account);
        }
        if (node.Node && Array.isArray(node.Node)) {
          getAccountsRecursively(node.Node);
        }
      }
    };
    try {
      const jobs = detail.job[Object.keys(detail.job)[0]];
      jobs.forEach((job: any) => {
        const tree = job.Base.first_pass_ledger_witness.tree;
        getAccountsRecursively(tree.Node);
      });
      return accounts;
    } catch (e) {
      return [];
    }
  }
}
