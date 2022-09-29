import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_CHANGE_TAB, NETWORK_SET_ACTIVE_ROW, NetworkChangeTab, NetworkSetActiveRow } from '@network/network.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkMessage } from '@shared/types/network/network-message.type';
import { MinaJsonViewerComponent } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { NetworkConnection } from '@shared/types/network/network-connection.type';
import { selectNetworkActiveRow, selectNetworkConnection, selectNetworkFullMessage, selectNetworkMessageHex } from '@network/network.state';
import { downloadJson, downloadJsonFromURL } from '@shared/helpers/user-input.helper';
import { Clipboard } from '@angular/cdk/clipboard';
import { filter } from 'rxjs';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { environment } from '@environment/environment.prod';
import { isNumber } from 'chart.js/helpers';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';

@UntilDestroy()
@Component({
  selector: 'mina-network-side-panel',
  templateUrl: './network-side-panel.component.html',
  styleUrls: ['./network-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkSidePanelComponent extends ManualDetection implements AfterViewInit {

  activeRow: NetworkMessage;
  connection: NetworkConnection;
  activeRowFullMessage: any;
  activeRowHexDisplayedValue: string;
  selectedTabIndex: number = 1;
  jsonTooBig: boolean;

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;
  @ViewChild('saveButton') private saveButton: ElementRef<HTMLButtonElement>;
  private activeRowHex: string;
  private cancelDownload: boolean = false;

  constructor(private store: Store<MinaState>,
              private clipboard: Clipboard,
              private router: Router) { super(); }

  ngAfterViewInit(): void {
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((activeRow: NetworkMessage) => {
        this.activeRow = activeRow;
        if (!activeRow) {
          this.cancelDownload = true;
          this.saveButton.nativeElement.textContent = 'Save';
          this.activeRowFullMessage = this.activeRowHex = this.activeRowHexDisplayedValue = this.connection = undefined;
        }
        this.detect();
      });

    this.store.select(selectNetworkFullMessage)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((message: any) => {
        this.jsonTooBig = isNumber(message) ? Number(message) > 10485760 : false;
        this.activeRowFullMessage = message;
        this.detect();
      });
    this.store.select(selectNetworkMessageHex)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((hex: string) => {
        this.activeRowHex = hex;
        this.activeRowHexDisplayedValue = NetworkSidePanelComponent.getActiveRowHexDisplayedValue(hex);
        this.detect();
      });
    this.store.select(selectNetworkConnection)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((connection: NetworkConnection) => {
        this.connection = connection;
        this.detect();
      });
  }

  private static getActiveRowHexDisplayedValue(hex: string): string {
    return hex.length < 600 ? hex : hex.slice(0, 500) + '...' + hex.slice(hex.length - 9);
  }

  downloadJson(): void {
    const fileName = this.selectedTabIndex === 2 ? 'message_hex.txt' : 'network_data.json';
    if (this.jsonTooBig && this.selectedTabIndex === 1) {
      this.cancelDownload = false;
      const url = environment.debugger + '/message/' + this.activeRow.id;
      downloadJsonFromURL(url, fileName, () => this.cancelDownload, this.saveButton.nativeElement);
      return;
    }
    const toDownload = this.selectedTabIndex === 1
      ? this.activeRowFullMessage
      : this.selectedTabIndex === 2
        ? this.activeRowHex
        : this.connection;
    downloadJson(toDownload, fileName);
  }

  copyToClipboard(): void {
    const toCopy = this.selectedTabIndex === 1
      ? JSON.stringify(this.activeRowFullMessage)
      : this.selectedTabIndex === 2
        ? this.activeRowHex
        : JSON.stringify(this.connection);
    this.clipboard.copy(toCopy);
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.NETWORK], { queryParamsHandling: 'merge' });
    this.store.dispatch<NetworkSetActiveRow>({ type: NETWORK_SET_ACTIVE_ROW, payload: undefined });
  }

  expandEntireJSON(): void {
    this.minaJsonViewer.toggleAll(true);
  }

  collapseEntireJSON(): void {
    this.minaJsonViewer.toggleAll(false);
  }

  selectTab(tabNum: number): void {
    this.cancelDownload = true;
    this.saveButton.nativeElement.textContent = 'Save';
    this.selectedTabIndex = tabNum;
    this.store.dispatch<NetworkChangeTab>({ type: NETWORK_CHANGE_TAB, payload: tabNum });
  }
}
