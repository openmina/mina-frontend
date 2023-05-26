import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Routes } from '@shared/enums/routes.enum';
import { NetworkConnection } from '@shared/types/network/connections/network-connection.type';
import { selectNetworkConnections, selectNetworkConnectionsActiveConnection } from '@network/connections/network-connections.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NETWORK_CONNECTIONS_SELECT_CONNECTION, NetworkConnectionsSelectConnection } from '@network/connections/network-connections.actions';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { filter, take } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { SW_TRACES_SET_ACTIVE_JOB, SWTracesSetActiveJob } from '@explorer/snark-workers-traces/snark-workers-traces.actions';

@UntilDestroy()
@Component({
  selector: 'mina-network-connections-table',
  templateUrl: './network-connections-table.component.html',
  styleUrls: ['./network-connections-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkConnectionsTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;

  connections: NetworkConnection[] = [];
  activeRow: NetworkConnection;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;

  private idFromRoute: number;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToNetworkConnectionsChanges();
    this.listenToActiveRowChange();
  }

  private listenToRouteChange(): void {
    this.store.select(getMergedRoute)
      .pipe(untilDestroyed(this), take(1))
      .subscribe((route: MergedRoute) => {
        if (route.params['id'] && this.connections.length === 0) {
          this.idFromRoute = Number(route.params['id']);
        }
      });
  }

  private listenToNetworkConnectionsChanges(): void {
    this.store.select(selectNetworkConnections)
      .pipe(untilDestroyed(this), filter(connections => connections.length > 0))
      .subscribe((connections: NetworkConnection[]) => {
        this.connections = connections;
        this.detect();
        this.scrollToElement();
      });
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkConnectionsActiveConnection)
      .pipe(untilDestroyed(this))
      .subscribe((connection: NetworkConnection) => {
        this.activeRow = connection;
        this.detect();
      });
  }

  onRowClick(row: NetworkConnection): void {
    if (row.connectionId !== this.activeRow?.connectionId) {
      this.router.navigate([Routes.NETWORK, Routes.CONNECTIONS, row.connectionId], { queryParamsHandling: 'merge' });
      this.setActiveRow(row);
    }
  }

  private setActiveRow(row: NetworkConnection): void {
    this.store.dispatch<NetworkConnectionsSelectConnection>({ type: NETWORK_CONNECTIONS_SELECT_CONNECTION, payload: row });
  }

  private scrollToElement(): void {
    if (this.idFromRoute) {
      const topElements = Math.round(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize) - 3;
      const index = this.connections.findIndex(c => c.connectionId === this.idFromRoute);
      this.idFromRoute = undefined;
      this.scrollViewport.scrollToIndex(index - topElements);
      this.setActiveRow(this.connections[index]);
    }
  }

  goToNetworkMessages(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
      queryParamsHandling: 'merge',
    });
  }
}
