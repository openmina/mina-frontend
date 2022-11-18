import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import {
  selectNetworkBlocksActiveBlock,
  selectNetworkBlocksActiveFilters,
  selectNetworkBlocksAllFilters,
  selectNetworkBlocksEarliestBlock,
} from '@network/blocks/network-blocks.state';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import {
  NETWORK_BLOCKS_SET_ACTIVE_BLOCK,
  NETWORK_BLOCKS_TOGGLE_FILTER,
  NetworkBlocksSetActiveBlock,
  NetworkBlocksToggleFilter,
} from '@network/blocks/network-blocks.actions';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-toolbar',
  templateUrl: './network-blocks-toolbar.component.html',
  styleUrls: ['./network-blocks-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom flex-column' },
})
export class NetworkBlocksToolbarComponent extends ManualDetection implements OnInit {

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
    this.store.select(selectNetworkBlocksAllFilters)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((filters: string[]) => {
        this.allFilters = filters;
        this.detect();
      });
    this.store.select(selectNetworkBlocksActiveFilters)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe((filters: string[]) => {
        this.activeFilters = filters;
        this.detect();
      });
  }

  private listenToActiveBlockChanges(): void {
    this.store.select(selectNetworkBlocksActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectNetworkBlocksEarliestBlock)
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
    this.store.dispatch<NetworkBlocksToggleFilter>({ type: NETWORK_BLOCKS_TOGGLE_FILTER, payload: filter });
  }

  getBlock(height: number): void {
    this.store.dispatch<NetworkBlocksSetActiveBlock>({ type: NETWORK_BLOCKS_SET_ACTIVE_BLOCK, payload: { height, fetchNew: true } });
    this.router.navigate([Routes.NETWORK, Routes.BLOCKS, height]);
  }
}
