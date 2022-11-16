import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_CHANGE_TAB, NETWORK_SET_ACTIVE_ROW, NetworkMessagesChangeTab, NetworkMessagesSetActiveRow } from '@network/messages/network-messages.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { NetworkMessageConnection } from '@shared/types/network/messages/network-messages-connection.type';
import { selectNetworkActiveRow, selectNetworkConnection, selectNetworkFullMessage, selectNetworkMessageHex } from '@network/messages/network-messages.state';
import { downloadJson, downloadJsonFromURL } from '@shared/helpers/user-input.helper';
import { filter } from 'rxjs';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { CONFIG } from '@shared/constants/config';
import { isNumber } from '@ngrx/store/src/meta-reducers/utils';

@UntilDestroy()
@Component({
  selector: 'mina-network-messages-side-panel',
  templateUrl: './network-messages-side-panel.component.html',
  styleUrls: ['./network-messages-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100' },
})
export class NetworkMessagesSidePanelComponent extends ManualDetection implements AfterViewInit {

  activeRow: NetworkMessage;
  connection: NetworkMessageConnection;
  activeRowFullMessage: any;
  activeRowHexDisplayedValue: string;
  selectedTabIndex: number = 1;
  jsonTooBig: boolean;
  toCopy: string;
  expandingTracking: ExpandTracking = {};

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;
  @ViewChild('saveButton') private saveButton: ElementRef<HTMLButtonElement>;

  private activeRowHex: string;
  private cancelDownload: boolean = false;
  private userDidHitExpandAll: boolean;
  private currentMessageKind: string;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngAfterViewInit(): void {
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkActiveRow)
      .pipe(untilDestroyed(this))
      .subscribe((activeRow: NetworkMessage) => {
        this.activeRow = activeRow;
        if (activeRow) {
          if (activeRow.messageKind !== this.currentMessageKind) {
            this.expandingTracking = {}; // reset
          }
          this.currentMessageKind = activeRow.messageKind;
        }

        if (!activeRow) {
          this.cancelDownload = true;
          this.saveButton.nativeElement.textContent = 'Save JSON';
          this.activeRowFullMessage = this.activeRowHex = this.activeRowHexDisplayedValue = this.connection = undefined;
        }
        this.detect();
      });

    this.store.select(selectNetworkFullMessage)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((message: any) => {
        this.jsonTooBig = !isNaN(message) ? Number(message) > 10485760 : false;
        this.activeRowFullMessage = message;
        this.setToCopy();
        this.detect();
      });
    this.store.select(selectNetworkMessageHex)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((hex: string) => {
        this.activeRowHex = hex;
        this.activeRowHexDisplayedValue = NetworkMessagesSidePanelComponent.getActiveRowHexDisplayedValue(hex);
        this.setToCopy();
        this.detect();
      });
    this.store.select(selectNetworkConnection)
      .pipe(untilDestroyed(this), filter(Boolean))
      .subscribe((connection: NetworkMessageConnection) => {
        this.connection = connection;
        this.setToCopy();
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
      const URL = CONFIG.debugger + '/message/' + this.activeRow.id;
      downloadJsonFromURL(URL, fileName, () => this.cancelDownload, this.saveButton.nativeElement);
      return;
    }
    const toDownload = this.selectedTabIndex === 1
      ? this.activeRowFullMessage
      : this.selectedTabIndex === 2
        ? this.activeRowHex
        : this.connection;
    downloadJson(toDownload, fileName);
  }

  downloadBinary(): void {
    const fileName = this.activeRow.id + '_binary.bin';
    this.cancelDownload = false;
    const URL = CONFIG.debugger + '/message_bin/' + this.activeRow.id;
    downloadJsonFromURL(URL, fileName, () => null);
  }

  private setToCopy(): void {
    this.toCopy = this.selectedTabIndex === 1
      ? JSON.stringify(this.activeRowFullMessage)
      : this.selectedTabIndex === 2
        ? this.activeRowHex
        : JSON.stringify(this.connection);
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], { queryParamsHandling: 'merge' });
    this.store.dispatch<NetworkMessagesSetActiveRow>({ type: NETWORK_SET_ACTIVE_ROW, payload: undefined });
  }

  expandEntireJSON(): void {
    this.userDidHitExpandAll = true;
    this.expandingTracking = this.minaJsonViewer.toggleAll(this.userDidHitExpandAll);
  }

  collapseEntireJSON(): void {
    this.userDidHitExpandAll = false;
    this.expandingTracking = this.minaJsonViewer.toggleAll(this.userDidHitExpandAll);
  }

  selectTab(tabNum: number): void {
    this.cancelDownload = true;
    this.saveButton.nativeElement.textContent = 'Save JSON';
    this.selectedTabIndex = tabNum;
    this.store.dispatch<NetworkMessagesChangeTab>({ type: NETWORK_CHANGE_TAB, payload: tabNum });
    this.setToCopy();
  }
}
