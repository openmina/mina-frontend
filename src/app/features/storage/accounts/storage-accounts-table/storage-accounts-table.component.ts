import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { filter } from 'rxjs';
import { selectStorageAccountsAccountList, selectStorageAccountsActiveAccount } from '@storage/accounts/storage-accounts.state';
import { untilDestroyed } from '@ngneat/until-destroy';
import { StorageAccountsSetActiveAccount } from '@storage/accounts/storage-accounts.actions';

@Component({
  selector: 'mina-storage-accounts-table',
  templateUrl: './storage-accounts-table.component.html',
  styleUrls: ['./storage-accounts-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StorageAccountsTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<StorageAccount> = [
    { name: 'public key' },
    { name: 'balance' },
    { name: 'nonce' },
    { name: 'token ID' },
  ];

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<StorageAccount>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private table: MinaTableComponent<StorageAccount>;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<StorageAccount>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [220, 170, 100, 220];
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((account: StorageAccount) => this.onAccountClick(account));
      this.table.propertyForActiveCheck = 'publicKey';
      this.table.init();
    });
    this.listenToAccountsChanges();
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

  private onAccountClick(account: StorageAccount): void {
    this.dispatch(StorageAccountsSetActiveAccount, account);
  }
}
