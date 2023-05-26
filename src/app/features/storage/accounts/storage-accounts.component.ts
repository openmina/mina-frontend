import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { StorageAccountsClose, StorageAccountsGetAccounts } from '@storage/accounts/storage-accounts.actions';
import { selectActiveNode } from '@app/app.state';
import { filter } from 'rxjs';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
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

  private removedClass: boolean;

  @ViewChild('tableWrapper') private tableWrapper: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToActiveRowChange();
  }

  toggleResizing(): void {
    this.tableWrapper.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableWrapper.nativeElement.style.width = `calc(100% - ${width}px)`;
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
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
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
