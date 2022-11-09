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

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNetworkConnectionsChanges();
    this.listenToActiveRowChange();
  }

  private listenToNetworkConnectionsChanges(): void {
    this.store.select(selectNetworkConnections)
      .pipe(untilDestroyed(this))
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
      this.store.dispatch<NetworkConnectionsSelectConnection>({ type: NETWORK_CONNECTIONS_SELECT_CONNECTION, payload: row });
    }
  }

  private scrollToElement(): void {
    let scrollTo = this.connections.length;
    // if (this.idFromRoute) {
    //   const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
    //   scrollTo = this.connections.findIndex(m => m.connectionId === this.idFromRoute) - topElements;
    //   this.idFromRoute = undefined;
    // }
    this.scrollViewport.scrollToIndex(scrollTo);
  }

  goToNetworkMessages(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
    });
  }
}
