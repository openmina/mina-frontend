import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GraphQLService } from '../core/services/graph-ql.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent implements OnInit {

  accounts: any[] = [];
  gql = `batchBalance($account0: PublicKey!, $account1: PublicKey!, $account2: PublicKey!, $account3: PublicKey!) {
  account0: account(publicKey: $account0) {
    balance {
      total
    }
    publicKey
  }
  account1: account(publicKey: $account1) {
    balance {
      total
    }
    publicKey
  }
  account2: account(publicKey: $account2) {
    balance {
      total
    }
    publicKey
  }
  account3: account(publicKey: $account3) {
    balance {
      total
    }
    publicKey
  }
}
`;
  variables = {
    account0: 'B62qph9JQRsCw49h5ezVVCCFrGc9rQsJhPhHUJNPUHy7VBtSojsiAji',
    account1: 'B62qqEmfxvB3pSFxJa9vAvb3iGoZDpobAtrxGp2rPSbTBTC7hRjpzCh',
    account2: 'B62qpR7ARvBRZdF2EkaRJPKVWocWyH7xfoYD8GDswJsvaA5eYH54q7b',
    account3: 'B62qqXi8mm3UsY45DJFpEc6KK4k69hcVmWf6xm4FRYcuUKXUGW2BGit',
  };

  constructor(private graphQL: GraphQLService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.graphQL.query('AccountsQuery', this.gql, this.variables)
      .subscribe((accounts: any) => {
        this.accounts = Object.keys(accounts).map(key => accounts[key]);
        this.cdRef.detectChanges();
      });
  }

}
