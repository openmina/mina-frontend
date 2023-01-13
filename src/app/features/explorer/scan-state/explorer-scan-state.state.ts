import { createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectExplorerScanState } from '@explorer/explorer.state';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';

export interface ExplorerScanState {
  scanState: ExplorerScanStateTree[];
  activeBlock: number;
  earliestBlock: number;
  firstBlock: number;
  txCount: number;
  snarksCount: number;
  leafsMarking: boolean;
}

const select = <T>(selector: (state: ExplorerScanState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectExplorerScanState,
  selector,
);

export const selectExplorerScanStateTree = select((state: ExplorerScanState): ExplorerScanStateTree[] => state.scanState);
export const selectExplorerScanStateActiveBlock = select((state: ExplorerScanState): number => state.activeBlock);
export const selectExplorerScanStateEarliestBlock = select((state: ExplorerScanState): number => state.earliestBlock);
export const selectExplorerScanStateFirstBlock = select((state: ExplorerScanState): number => state.firstBlock);
export const selectExplorerScanStateTxSnarks = select((state: ExplorerScanState): { txCount: number, snarksCount: number } =>
  ({ txCount: state.txCount, snarksCount: state.snarksCount }),
);
export const selectExplorerLeafsMarking  = select((state: ExplorerScanState): boolean => state.leafsMarking);
