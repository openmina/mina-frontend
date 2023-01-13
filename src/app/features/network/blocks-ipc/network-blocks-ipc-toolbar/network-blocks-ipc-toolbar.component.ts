import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import {
  NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_IPC_TOGGLE_FILTER,
  NetworkBlocksIpcSetActiveBlock,
  NetworkBlocksIpcToggleFilter,
} from '@network/blocks-ipc/network-blocks-ipc.actions';
import {
  selectNetworkBlocksIpcActiveBlock,
  selectNetworkBlocksIpcActiveFilters,
  selectNetworkBlocksIpcAllFilters,
  selectNetworkBlocksIpcEarliestBlock,
} from '@network/blocks-ipc/network-blocks-ipc.state';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-ipc-toolbar',
  templateUrl: './network-blocks-ipc-toolbar.component.html',
  styleUrls: ['./network-blocks-ipc-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom flex-column' },
})
export class NetworkBlocksIpcToolbarComponent extends ManualDetection implements OnInit {

  activeFilters: string[] = [];
  allFilters: string[] = [];
  activeBlock: number;
  earliestBlock: number;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanges();
    this.listenToActiveBlockChanges();
  }

  private listenToFiltersChanges(): void {
    this.store.select(selectNetworkBlocksIpcAllFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.allFilters = filters;
        this.detect();
      });
    this.store.select(selectNetworkBlocksIpcActiveFilters)
      .pipe(untilDestroyed(this))
      .subscribe((filters: string[]) => {
        this.activeFilters = filters;
        this.detect();
      });
  }

  private listenToActiveBlockChanges(): void {
    this.store.select(selectNetworkBlocksIpcActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectNetworkBlocksIpcEarliestBlock)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(earliestBlock => this.earliestBlock !== earliestBlock),
      )
      .subscribe((earliestBlock: number) => {
        this.earliestBlock = earliestBlock;
        this.detect();
      });
  }

  toggleFilter(filter: string): void {
    this.store.dispatch<NetworkBlocksIpcToggleFilter>({ type: NETWORK_BLOCKS_IPC_TOGGLE_FILTER, payload: filter });
  }

  getBlock(height: number): void {
    this.store.dispatch<NetworkBlocksIpcSetActiveBlock>({ type: NETWORK_BLOCKS_IPC_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
    this.router.navigate([Routes.NETWORK, Routes.BLOCKS_IPC, height]);
  }
}
