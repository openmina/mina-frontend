import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { filter } from 'rxjs';
import { selectStorageAccountsAccountList, selectStorageAccountsActiveAccount } from '@storage/accounts/storage-accounts.state';
import { StorageAccountsSetActiveAccount } from '@storage/accounts/storage-accounts.actions';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-storage-accounts-table',
  templateUrl: './storage-accounts-table.component.html',
  styleUrls: ['./storage-accounts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StorageAccountsTableComponent extends MinaTableWrapper<StorageAccount> implements OnInit {

  protected readonly tableHeads: TableColumnList<StorageAccount> = [
    { name: 'public key' },
    { name: 'balance' },
    { name: 'nonce' },
    { name: 'token ID' },
  ];

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToAccountsChanges();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [220, 170, 100, 220];
    this.table.propertyForActiveCheck = 'publicKey';
  }

  private listenToAccountsChanges(): void {
    this.select(selectStorageAccountsAccountList, (accounts: StorageAccount[]) => {
      this.table.rows = accounts;
      this.table.detect();
    }, filter(a => a.length > 0));

    this.select(selectStorageAccountsActiveAccount, (account: StorageAccount) => {
      this.table.activeRow = account;
      this.table.detect();
    });
  }

  protected override onRowClick(account: StorageAccount): void {
    this.dispatch(StorageAccountsSetActiveAccount, account);
  }
}
