import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { selectNetworkConnectionsActiveConnection } from '@network/connections/network-connections.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkConnection } from '@shared/types/network/connections/network-connection.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { NETWORK_CONNECTIONS_SELECT_CONNECTION, NetworkConnectionsSelectConnection } from '@network/connections/network-connections.actions';
import { downloadJson } from '@app/shared/helpers/user-input.helper';
import { ExpandTracking, MinaJsonViewerComponent } from '@shared/components/mina-json-viewer/mina-json-viewer.component';

@UntilDestroy()
@Component({
  selector: 'mina-network-connections-side-panel',
  templateUrl: './network-connections-side-panel.component.html',
  styleUrls: ['./network-connections-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column border-left' },
})
export class NetworkConnectionsSidePanelComponent extends ManualDetection implements OnInit {

  connection: NetworkConnection;
  jsonString: string;
  expandingTracking: ExpandTracking = {};

  @ViewChild(MinaJsonViewerComponent) private minaJsonViewer: MinaJsonViewerComponent;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveRowChange();
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkConnectionsActiveConnection)
      .pipe(untilDestroyed(this))
      .subscribe((connection: NetworkConnection) => {
        this.connection = connection;
        this.jsonString = JSON.stringify(connection);
        this.detect();
      });
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.NETWORK, Routes.CONNECTIONS], { queryParamsHandling: 'merge' });
    this.store.dispatch<NetworkConnectionsSelectConnection>({ type: NETWORK_CONNECTIONS_SELECT_CONNECTION, payload: undefined });
  }

  downloadJson(): void {
    downloadJson(this.jsonString, 'network-connection.json');
  }

  expandEntireJSON(): void {
    this.expandingTracking = this.minaJsonViewer.toggleAll(true);
  }

  collapseEntireJSON(): void {
    this.expandingTracking = this.minaJsonViewer.toggleAll(false);
  }
}
