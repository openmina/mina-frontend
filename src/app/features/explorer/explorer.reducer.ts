import { ActionReducer, combineReducers } from '@ngrx/store';

import * as fromBlocks from '@explorer/blocks/explorer-blocks.reducer';
import * as fromTxs from '@explorer/transactions/explorer-transactions.reducer';
import * as fromSnarks from '@explorer/snarks/explorer-snarks.reducer';
import * as fromScanState from '@explorer/scan-state/explorer-scan-state.reducer';
import * as fromSnarkTraces from '@explorer/snark-workers-traces/snark-workers-traces.reducer';
import { ExplorerBlocksAction, ExplorerBlocksActions } from '@explorer/blocks/explorer-blocks.actions';
import { ExplorerState } from '@explorer/explorer.state';
import { ExplorerTransactionsAction, ExplorerTransactionsActions } from '@explorer/transactions/explorer-transactions.actions';
import { ExplorerSnarksAction, ExplorerSnarksActions } from '@explorer/snarks/explorer-snarks.actions';
import { ExplorerScanStateAction, ExplorerScanStateActions } from '@explorer/scan-state/explorer-scan-state.actions';
import { SWTracesAction, SWTracesActions } from '@explorer/snark-workers-traces/snark-workers-traces.actions';

export type ExplorerActions = ExplorerBlocksActions & ExplorerTransactionsActions & ExplorerSnarksActions & ExplorerScanStateActions & SWTracesActions;
export type ExplorerAction = ExplorerBlocksAction & ExplorerTransactionsAction & ExplorerSnarksAction & ExplorerScanStateAction & SWTracesAction;

export const reducer: ActionReducer<ExplorerState, ExplorerActions> = combineReducers<ExplorerState, ExplorerActions>({
  blocks: fromBlocks.reducer,
  transactions: fromTxs.reducer,
  snarks: fromSnarks.reducer,
  scanState: fromScanState.reducer,
  snarksTraces: fromSnarkTraces.reducer,
});
