import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { NetworkConnection } from '@shared/types/network/connections/network-connection.type';
import { selectNetworkConnections, selectNetworkConnectionsActiveConnection } from '@network/connections/network-connections.state';
import { untilDestroyed } from '@ngneat/until-destroy';
import { NetworkConnectionsSelectConnection } from '@network/connections/network-connections.actions';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { filter, take } from 'rxjs';
import { MergedRoute } from '@shared/router/merged-route';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-network-connections-table',
  templateUrl: './network-connections-table.component.html',
  styleUrls: ['./network-connections-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class NetworkConnectionsTableComponent extends StoreDispatcher implements OnInit {

  private readonly tableHeads: TableColumnList<NetworkConnection> = [
    { name: 'ID' },
    { name: 'datetime' },
    { name: 'remote address' },
    { name: 'PID' },
    { name: 'FD' },
    { name: 'incoming' },
    { name: 'alias' },
    { name: 'decrypted in' },
    { name: 'decrypted out' },
  ];

  @ViewChild('rowTemplate') private rowTemplate: TemplateRef<NetworkConnection>;
  @ViewChild('minaTable', { read: ViewContainerRef }) private containerRef: ViewContainerRef;

  private connections: NetworkConnection[] = [];
  private activeRow: NetworkConnection;
  private idFromRoute: number;
  private table: MinaTableComponent<NetworkConnection>;

  constructor(private router: Router) { super(); }

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<NetworkConnection>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.gridTemplateColumns = [80, 170, 190, 90, 60, 100, 120, 110, 110];
      this.table.rowClickEmitter.pipe(untilDestroyed(this)).subscribe((row: NetworkConnection) => this.onRowClick(row));
      this.table.propertyForActiveCheck = 'connectionId';
      this.table.init();
    });
    this.listenToRouteChange();
    this.listenToNetworkConnectionsChanges();
    this.listenToActiveRowChange();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['id'] && this.connections.length === 0) {
        this.idFromRoute = Number(route.params['id']);
      }
    }, take(1));
  }

  private listenToNetworkConnectionsChanges(): void {
    this.select(selectNetworkConnections, (connections: NetworkConnection[]) => {
      this.connections = connections;
      this.table.rows = connections;
      this.table.detect();
      this.scrollToElement();
    }, filter(connections => connections.length > 0));
  }

  private listenToActiveRowChange(): void {
    this.select(selectNetworkConnectionsActiveConnection, (connection: NetworkConnection) => {
      this.activeRow = connection;
      this.table.activeRow = connection;
      this.table.detect();
    });
  }

  onRowClick(row: NetworkConnection): void {
    if (row.connectionId !== this.activeRow?.connectionId) {
      this.router.navigate([Routes.NETWORK, Routes.CONNECTIONS, row.connectionId], { queryParamsHandling: 'merge' });
      this.setActiveRow(row);
    }
  }

  private setActiveRow(row: NetworkConnection): void {
    this.dispatch(NetworkConnectionsSelectConnection, row);
  }

  private scrollToElement(): void {
    if (this.idFromRoute) {
      this.table.scrollToElement(c => c.connectionId === this.idFromRoute);
      delete this.idFromRoute;
    }
  }

  goToNetworkMessages(addr: string): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
      queryParamsHandling: 'merge',
    });
  }
}
