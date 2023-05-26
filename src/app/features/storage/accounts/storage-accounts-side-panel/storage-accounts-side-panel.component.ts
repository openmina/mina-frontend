import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { downloadJson } from '@shared/helpers/user-input.helper';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectStorageAccountsActiveAccount } from '@storage/accounts/storage-accounts.state';
import { StorageAccount } from '@shared/types/storage/accounts/storage-account.type';
import { StorageAccountsSetActiveAccount } from '@storage/accounts/storage-accounts.actions';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';

@Component({
  selector: 'mina-storage-accounts-side-panel',
  templateUrl: './storage-accounts-side-panel.component.html',
  styleUrls: ['./storage-accounts-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-100' },
})
export class StorageAccountsSidePanelComponent extends StoreDispatcher implements OnInit {

  activeRow: StorageAccount;
  toCopy: string;
  expandTracking: ExpandTracking = {};

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  private userDidHitExpandAll: boolean;

  ngOnInit(): void {
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.select(selectStorageAccountsActiveAccount, (activeRow: StorageAccount) => {
      this.activeRow = activeRow;
      this.toCopy = JSON.stringify(activeRow, null, 2);
      this.detect();
    });
  }

  closeSidePanel(): void {
    this.dispatch(StorageAccountsSetActiveAccount, undefined);
  }

  downloadJson(): void {
    const fileName = 'storage_account.json';
    downloadJson(this.activeRow, fileName);
  }

  expandEntireJSON(): void {
    this.userDidHitExpandAll = true;
    this.expandTracking = this.minaJsonViewer.toggleAll(this.userDidHitExpandAll);
  }

  collapseEntireJSON(): void {
    this.userDidHitExpandAll = false;
    this.expandTracking = this.minaJsonViewer.toggleAll(this.userDidHitExpandAll);
  }
}
