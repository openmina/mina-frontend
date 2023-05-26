import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { StorageAccountsChangePage, StorageAccountsGetAccounts } from '@storage/accounts/storage-accounts.actions';
import { selectStorageAccountsAccountList, selectStorageAccountsPagination } from '@storage/accounts/storage-accounts.state';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { StorageAccountsPagination } from '@shared/types/storage/accounts/storage-accounts-pagination.type';

@Component({
  selector: 'mina-storage-accounts-toolbar',
  templateUrl: './storage-accounts-toolbar.component.html',
  styleUrls: ['./storage-accounts-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row flex-between h-xl border-bottom' },
})
export class StorageAccountsToolbarComponent extends StoreDispatcher implements OnInit {

  pageStart: number;
  pageSize: number;
  accountsLength: number;

  ngOnInit(): void {
    this.listenToPageChange();
    this.listenToAccounts();
  }

  refetchReports(): void {
    this.dispatch(StorageAccountsGetAccounts);
  }

  changePage(start: number): void {
    this.dispatch(StorageAccountsChangePage, { start: Math.max(0, start) });
  }

  private listenToAccounts(): void {
    this.select(selectStorageAccountsAccountList, (accounts: StorageAccount[]) => {
      this.accountsLength = accounts.length;
      this.detect();
    });
  }

  private listenToPageChange(): void {
    this.select(selectStorageAccountsPagination, (pagination: StorageAccountsPagination) => {
      this.pageStart = pagination.start;
      this.pageSize = pagination.size;
      this.detect();
    });
  }
}
