import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import {
  selectExplorerScanStateLeafsMarking,
  selectExplorerScanStateActiveBlock,
  selectExplorerScanStateEarliestBlock,
  selectExplorerScanStateFirstBlock,
  selectExplorerScanStateTxSnarks,
} from '@explorer/scan-state/explorer-scan-state.state';
import {
  EXPLORER_SCAN_STATE_CENTER_TREES,
  EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK,
  EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING, ExplorerScanStateCenterTrees,
  ExplorerScanStateSetActiveBlock,
  ExplorerScanStateToggleLeafsMarking,
} from '@explorer/scan-state/explorer-scan-state.actions';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-scan-state-toolbar',
  templateUrl: './explorer-scan-state-toolbar.component.html',
  styleUrls: ['./explorer-scan-state-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-bottom h-xl' },
})
export class ExplorerScanStateToolbarComponent extends ManualDetection implements OnInit {

  activeBlock: number;
  earliestBlock: number;
  firstBlock: number;
  txCount: number;
  snarksCount: number;
  userCommandsCount: number;
  feeTransferCount: number;
  zkappCommandsCount: number;
  leafsMarking: boolean;

  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToStore();
  }

  private listenToStore(): void {
    this.store.select(selectExplorerScanStateTxSnarks)
      .pipe(untilDestroyed(this))
      .subscribe((data: { txCount: number; snarksCount: number; userCommandsCount: number; feeTransferCount: number; zkappCommandsCount: number }) => {
        this.txCount = data.txCount;
        this.snarksCount = data.snarksCount;
        this.userCommandsCount = data.userCommandsCount;
        this.feeTransferCount = data.feeTransferCount;
        this.zkappCommandsCount = data.zkappCommandsCount;
        this.detect();
      });
    this.store.select(selectExplorerScanStateActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((block: number) => {
        this.activeBlock = block;
        this.detect();
      });

    this.store.select(selectExplorerScanStateEarliestBlock)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(earliestBlock => this.earliestBlock !== earliestBlock),
      )
      .subscribe((earliestBlock: number) => {
        this.earliestBlock = earliestBlock;
        this.detect();
      });
    this.store.select(selectExplorerScanStateFirstBlock)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(firstBlock => this.firstBlock !== firstBlock),
      )
      .subscribe((firstBlock: number) => {
        this.firstBlock = firstBlock;
        this.detect();
      });
    this.store.select(selectExplorerScanStateLeafsMarking)
      .pipe(untilDestroyed(this))
      .subscribe((leafsMarking: boolean) => {
        this.leafsMarking = leafsMarking;
        this.detect();
      });
  }

  getBlock(height: number): void {
    this.store.dispatch<ExplorerScanStateSetActiveBlock>({ type: EXPLORER_SCAN_STATE_SET_ACTIVE_BLOCK, payload: { height } });
    this.router.navigate([Routes.EXPLORER, Routes.SCAN_STATE, height], { queryParamsHandling: 'merge' });
  }

  toggleLeafsMarking(): void {
    this.store.dispatch<ExplorerScanStateToggleLeafsMarking>({ type: EXPLORER_SCAN_STATE_TOGGLE_LEAFS_MARKING });
  }

  centerTrees(): void {
    this.store.dispatch<ExplorerScanStateCenterTrees>({ type: EXPLORER_SCAN_STATE_CENTER_TREES });
  }
}
