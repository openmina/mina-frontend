import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NetworkTableComponent } from '@network/network-table/network-table.component';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkActiveRow } from '@network/network.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { NETWORK_CLOSE, NETWORK_INIT, NetworkClose, NetworkInit } from '@network/network.actions';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { APP_CHANGE_SUB_MENUS, AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkComponent extends ManualDetection implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(NetworkTableComponent) private tableComponent: NetworkTableComponent;
  @ViewChild(NetworkTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
    this.store.dispatch<NetworkInit>({ type: NETWORK_INIT });
    this.store.dispatch<AppChangeSubMenus>({ type: APP_CHANGE_SUB_MENUS, payload: [] });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((row: NetworkMessage) => {
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

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  checkVirtualScrollViewport(): void {
    this.tableComponent.scrollViewport.checkViewportSize();
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  scrollToTop(): void {
    this.tableComponent.scrollViewport.scrollToIndex(0);
  }

  ngOnDestroy(): void {
    this.store.dispatch<NetworkClose>({ type: NETWORK_CLOSE });
  }
}
