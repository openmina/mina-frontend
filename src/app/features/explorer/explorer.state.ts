import { MinaState } from '@app/app.setup';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ExplorerBlocksState } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerTransactionsState } from '@explorer/transactions/explorer-transactions.state';
import { ExplorerSnarksState } from '@explorer/snarks/explorer-snarks.state';
import { ExplorerScanState } from '@explorer/scan-state/explorer-scan-state.state';
import { SnarkWorkersTracesState } from '@explorer/snark-workers-traces/snark-workers-traces.state';

export interface ExplorerState {
  blocks: ExplorerBlocksState;
  transactions: ExplorerTransactionsState;
  snarks: ExplorerSnarksState;
  scanState: ExplorerScanState;
  snarksTraces: SnarkWorkersTracesState;
}

const select = <T>(selector: (state: ExplorerState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerState,
  selector,
);

export const selectExplorerState = createFeatureSelector<ExplorerState>('explorer');
export const selectExplorerBlocksState = select((state: ExplorerState): ExplorerBlocksState => state.blocks);
export const selectExplorerTransactionsState = select((state: ExplorerState): ExplorerTransactionsState => state.transactions);
export const selectExplorerSnarksState = select((state: ExplorerState): ExplorerSnarksState => state.snarks);
export const selectExplorerScanState = select((state: ExplorerState): ExplorerScanState => state.scanState);
export const selectExplorerSnarkTracesState = select((state: ExplorerState): SnarkWorkersTracesState => state.snarksTraces);
