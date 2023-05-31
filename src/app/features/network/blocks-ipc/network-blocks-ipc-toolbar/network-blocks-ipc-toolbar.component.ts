import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { NetworkBlocksIpcSetActiveBlock, NetworkBlocksIpcToggleFilter, NetworkBlocksIpcToggleSidePanel } from '@network/blocks-ipc/network-blocks-ipc.actions';
import {
  selectNetworkBlocksIpcActiveBlock,
  selectNetworkBlocksIpcActiveFilters,
  selectNetworkBlocksIpcAllFilters,
  selectNetworkBlocksIpcEarliestBlock,
} from '@network/blocks-ipc/network-blocks-ipc.state';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-network-blocks-ipc-toolbar',
  templateUrl: './network-blocks-ipc-toolbar.component.html',
  styleUrls: ['./network-blocks-ipc-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom flex-column' },
})
export class NetworkBlocksIpcToolbarComponent extends StoreDispatcher implements OnInit {

  activeFilters: string[] = [];
  allFilters: string[] = [];
  activeBlock: number;
  earliestBlock: number;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToActiveBlockChanges();
  }

  toggleFilter(filter: string): void {
    this.dispatch(NetworkBlocksIpcToggleFilter, filter);
  }

  getBlock(height: number): void {
    this.dispatch(NetworkBlocksIpcSetActiveBlock, { height, fetchNew: true });
    this.router.navigate([Routes.NETWORK, Routes.BLOCKS_IPC, height], { queryParamsHandling: 'merge' });
  }

  toggleSidePanel(): void {
    this.dispatch(NetworkBlocksIpcToggleSidePanel);
  }

  private listenToFiltersChanges(): void {
    this.select(selectNetworkBlocksIpcAllFilters, (filters: string[]) => {
      this.allFilters = filters;
      this.detect();
    });
    this.select(selectNetworkBlocksIpcActiveFilters, (filters: string[]) => {
      this.activeFilters = filters;
      this.detect();
    });
  }

  private listenToActiveBlockChanges(): void {
    this.select(selectNetworkBlocksIpcActiveBlock, (block: number) => {
      this.activeBlock = block;
      this.detect();
    });

    this.select(selectNetworkBlocksIpcEarliestBlock, (earliestBlock: number) => {
      this.earliestBlock = earliestBlock;
      this.detect();
    }, filter(Boolean), filter(earliestBlock => this.earliestBlock !== earliestBlock));
  }
}
