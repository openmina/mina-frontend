import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { StorageAccountsClose, StorageAccountsGetAccounts } from '@storage/accounts/storage-accounts.actions';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';
import { selectStorageAccountsActiveAccount } from '@storage/accounts/storage-accounts.state';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';

@Component({
  selector: 'mina-storage-accounts',
  templateUrl: './storage-accounts.component.html',
  styleUrls: ['./storage-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class StorageAccountsComponent extends StoreDispatcher implements OnInit {

  isActiveRow: boolean;

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, () => {
      this.dispatch(StorageAccountsGetAccounts);
    }, filter(Boolean));
  }

  private listenToActiveRowChange(): void {
    this.select(selectStorageAccountsActiveAccount, (row: StorageAccount) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(StorageAccountsClose);
  }
}
