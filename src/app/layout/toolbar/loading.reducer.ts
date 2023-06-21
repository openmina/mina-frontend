import { FeatureAction } from '@shared/types/store/feature-action.type';
import { MinaState } from '@app/app.setup';
import {
  DASHBOARD_SPLITS_CLOSE,
  DASHBOARD_SPLITS_GET_SPLITS,
  DASHBOARD_SPLITS_GET_SPLITS_SUCCESS,
  DASHBOARD_SPLITS_MERGE_NODES,
  DASHBOARD_SPLITS_MERGE_NODES_SUCCESS,
  DASHBOARD_SPLITS_SPLIT_NODES,
  DASHBOARD_SPLITS_SPLIT_NODES_SUCCESS,
} from '@dashboard/splits/dashboard-splits.actions';
import {
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_NODE,
  DASHBOARD_NODES_GET_NODES_SUCCESS,
  DASHBOARD_NODES_GET_TRACES,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_INIT,
  DASHBOARD_NODES_INIT_SUCCESS,
} from '@dashboard/nodes/dashboard-nodes.actions';
import {
  EXPLORER_BLOCKS_CLOSE,
  EXPLORER_BLOCKS_GET_BLOCKS,
  EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS,
  EXPLORER_BLOCKS_GET_TXS,
  EXPLORER_BLOCKS_GET_TXS_SUCCESS,
} from '@explorer/blocks/explorer-blocks.actions';
import {
  EXPLORER_SCAN_STATE_CLOSE,
  EXPLORER_SCAN_STATE_GET_SCAN_STATE,
  EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS,
} from '@explorer/scan-state/explorer-scan-state.actions';
import {
  SW_TRACES_CLOSE,
  SW_TRACES_GET_TRACES,
  SW_TRACES_GET_TRACES_SUCCESS,
  SW_TRACES_GET_WORKERS_SUCCESS,
  SW_TRACES_INIT,
} from '@explorer/snark-workers-traces/snark-workers-traces.actions';
import { EXPLORER_SNARKS_CLOSE, EXPLORER_SNARKS_GET_SNARKS, EXPLORER_SNARKS_GET_SNARKS_SUCCESS } from '@explorer/snarks/explorer-snarks.actions';
import {
  EXPLORER_TRANSACTIONS_CLOSE,
  EXPLORER_TRANSACTIONS_CREATE_TX,
  EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS,
  EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS,
} from '@explorer/transactions/explorer-transactions.actions';
import {
  NETWORK_BLOCKS_CLOSE,
  NETWORK_BLOCKS_GET_BLOCKS,
  NETWORK_BLOCKS_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_SET_EARLIEST_BLOCK,
} from '@network/blocks/network-blocks.actions';
import {
  NETWORK_BLOCKS_IPC_CLOSE,
  NETWORK_BLOCKS_IPC_GET_BLOCKS,
  NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS,
  NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK,
  NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK,
} from '@network/blocks-ipc/network-blocks-ipc.actions';
import {
  NETWORK_CONNECTIONS_CLOSE,
  NETWORK_CONNECTIONS_GET_CONNECTIONS,
  NETWORK_CONNECTIONS_GET_CONNECTIONS_SUCCESS,
} from '@network/connections/network-connections.actions';
import {
  NETWORK_CLOSE,
  NETWORK_GET_CONNECTION,
  NETWORK_GET_CONNECTION_SUCCESS,
  NETWORK_GET_FULL_MESSAGE,
  NETWORK_GET_FULL_MESSAGE_SUCCESS,
  NETWORK_GET_MESSAGE_HEX,
  NETWORK_GET_MESSAGE_HEX_SUCCESS,
} from '@network/messages/network-messages.actions';
import { SYSTEM_RESOURCES_CLOSE, SYSTEM_RESOURCES_GET_RESOURCES, SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS } from '@resources/system/system-resources.actions';
import {
  TRACING_OVERVIEW_CLOSE,
  TRACING_OVERVIEW_GET_CHECKPOINTS,
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS,
} from '@tracing/tracing-overview/tracing-overview.actions';
import {
  TRACING_BLOCKS_CLOSE,
  TRACING_BLOCKS_GET_DETAILS,
  TRACING_BLOCKS_GET_DETAILS_SUCCESS,
  TRACING_BLOCKS_GET_TRACES,
  TRACING_BLOCKS_GET_TRACES_SUCCESS,
} from '@tracing/tracing-blocks/tracing-blocks.actions';
import { WEB_NODE_WALLET_CLOSE, WEB_NODE_WALLET_GET_WALLETS, WEB_NODE_WALLET_GET_WALLETS_SUCCESS } from '@web-node/web-node-wallet/web-node-wallet.actions';
import {
  WEB_NODE_SHARED_GET_LOGS,
  WEB_NODE_SHARED_GET_LOGS_SUCCESS,
  WEB_NODE_SHARED_GET_PEERS,
  WEB_NODE_SHARED_GET_PEERS_SUCCESS,
} from '@web-node/web-node.actions';
import { APP_INIT, APP_INIT_SUCCESS } from '@app/app.actions';
import {
  DSW_ACTIONS_CLOSE,
  DSW_ACTIONS_GET_ACTIONS,
  DSW_ACTIONS_GET_ACTIONS_SUCCESS,
  DSW_ACTIONS_GET_EARLIEST_SLOT,
  DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS,
} from '@dsw/actions/dsw-actions.actions';
import {
  BENCHMARKS_WALLETS_CLOSE,
  BENCHMARKS_WALLETS_GET_WALLETS,
  BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS,
  BENCHMARKS_WALLETS_SEND_TX,
  BENCHMARKS_WALLETS_SEND_TX_SUCCESS,
  BENCHMARKS_WALLETS_SEND_TX_SYNCED,
} from '@benchmarks/wallets/benchmarks-wallets.actions';
import { WEB_NODE_PEERS_CLOSE } from '@web-node/web-node-peers/web-node-peers.actions';
import { WEB_NODE_LOGS_CLOSE } from '@web-node/web-node-logs/web-node-logs.actions';

export type LoadingState = string[];

const initialState: LoadingState = [];

export function reducer(state: LoadingState = initialState, action: FeatureAction<any>): LoadingState {
  switch (action.type) {
    case APP_INIT:

    case DASHBOARD_NODES_INIT:
    case DASHBOARD_NODES_GET_NODE:
    case DASHBOARD_NODES_GET_TRACES:

    case DASHBOARD_SPLITS_GET_SPLITS:
    case DASHBOARD_SPLITS_SPLIT_NODES:
    case DASHBOARD_SPLITS_MERGE_NODES:

    case BENCHMARKS_WALLETS_GET_WALLETS:
    case BENCHMARKS_WALLETS_SEND_TX:
    case BENCHMARKS_WALLETS_SEND_TX_SYNCED:

    case DSW_ACTIONS_GET_EARLIEST_SLOT:
    case DSW_ACTIONS_GET_ACTIONS:

    case EXPLORER_BLOCKS_GET_BLOCKS:
    case EXPLORER_BLOCKS_GET_TXS:

    case EXPLORER_SCAN_STATE_GET_SCAN_STATE:

    case SW_TRACES_INIT:
    case SW_TRACES_GET_TRACES:

    case EXPLORER_SNARKS_GET_SNARKS:

    case EXPLORER_TRANSACTIONS_GET_TRANSACTIONS:
    case EXPLORER_TRANSACTIONS_CREATE_TX:

    case NETWORK_BLOCKS_GET_EARLIEST_BLOCK:
    case NETWORK_BLOCKS_GET_BLOCKS:

    case NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK:
    case NETWORK_BLOCKS_IPC_GET_BLOCKS:

    case NETWORK_CONNECTIONS_GET_CONNECTIONS:

    case NETWORK_GET_FULL_MESSAGE:
    case NETWORK_GET_MESSAGE_HEX:
    case NETWORK_GET_CONNECTION:

    case SYSTEM_RESOURCES_GET_RESOURCES:

    case TRACING_OVERVIEW_GET_CHECKPOINTS:

    case TRACING_BLOCKS_GET_TRACES:
    case TRACING_BLOCKS_GET_DETAILS:

    case WEB_NODE_WALLET_GET_WALLETS:

    case WEB_NODE_SHARED_GET_PEERS:
    case WEB_NODE_SHARED_GET_LOGS:
      return add(state, action);

    /* ----------------------------- */
    case APP_INIT_SUCCESS:
      return remove(state, APP_INIT);

    case DASHBOARD_NODES_INIT_SUCCESS:
      return remove(state, DASHBOARD_NODES_INIT);
    case DASHBOARD_NODES_GET_NODES_SUCCESS:
      return remove(state, DASHBOARD_NODES_GET_NODE);
    case DASHBOARD_NODES_GET_TRACES_SUCCESS:
      return remove(state, DASHBOARD_NODES_GET_TRACES);
    case DASHBOARD_NODES_CLOSE:
      return remove(state, [DASHBOARD_NODES_INIT, DASHBOARD_NODES_GET_NODE, DASHBOARD_NODES_GET_TRACES]);

    case DASHBOARD_SPLITS_GET_SPLITS_SUCCESS:
      return remove(state, DASHBOARD_SPLITS_GET_SPLITS);
    case DASHBOARD_SPLITS_SPLIT_NODES_SUCCESS:
      return remove(state, DASHBOARD_SPLITS_SPLIT_NODES);
    case DASHBOARD_SPLITS_MERGE_NODES_SUCCESS:
      return remove(state, DASHBOARD_SPLITS_MERGE_NODES);
    case DASHBOARD_SPLITS_CLOSE:
      return remove(state, [DASHBOARD_SPLITS_GET_SPLITS, DASHBOARD_SPLITS_SPLIT_NODES, DASHBOARD_SPLITS_MERGE_NODES]);

    case BENCHMARKS_WALLETS_GET_WALLETS_SUCCESS:
      return remove(state, BENCHMARKS_WALLETS_GET_WALLETS);
    case BENCHMARKS_WALLETS_SEND_TX_SUCCESS:
      return remove(state, [BENCHMARKS_WALLETS_SEND_TX, BENCHMARKS_WALLETS_SEND_TX_SYNCED]);
    case BENCHMARKS_WALLETS_CLOSE:
      return remove(state, [BENCHMARKS_WALLETS_GET_WALLETS, BENCHMARKS_WALLETS_SEND_TX, BENCHMARKS_WALLETS_SEND_TX_SYNCED]);

    case DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS:
      return remove(state, DSW_ACTIONS_GET_EARLIEST_SLOT);
    case DSW_ACTIONS_GET_ACTIONS_SUCCESS:
      return remove(state, DSW_ACTIONS_GET_ACTIONS);
    case DSW_ACTIONS_CLOSE:
      return remove(state, [DSW_ACTIONS_GET_EARLIEST_SLOT, DSW_ACTIONS_GET_ACTIONS]);

    case EXPLORER_BLOCKS_GET_BLOCKS_SUCCESS:
      return remove(state, EXPLORER_BLOCKS_GET_BLOCKS);
    case EXPLORER_BLOCKS_GET_TXS_SUCCESS:
      return remove(state, EXPLORER_BLOCKS_GET_TXS);
    case EXPLORER_BLOCKS_CLOSE:
      return remove(state, [EXPLORER_BLOCKS_GET_BLOCKS, EXPLORER_BLOCKS_GET_TXS]);

    case EXPLORER_SCAN_STATE_GET_SCAN_STATE_SUCCESS:
      return remove(state, EXPLORER_SCAN_STATE_GET_SCAN_STATE);
    case EXPLORER_SCAN_STATE_CLOSE:
      return remove(state, [EXPLORER_SCAN_STATE_GET_SCAN_STATE]);

    case SW_TRACES_GET_WORKERS_SUCCESS:
      return remove(state, SW_TRACES_INIT);
    case SW_TRACES_GET_TRACES_SUCCESS:
      return remove(state, SW_TRACES_GET_TRACES);
    case SW_TRACES_CLOSE:
      return remove(state, [SW_TRACES_INIT, SW_TRACES_GET_TRACES]);

    case EXPLORER_SNARKS_GET_SNARKS_SUCCESS:
      return remove(state, EXPLORER_SNARKS_GET_SNARKS);
    case EXPLORER_SNARKS_CLOSE:
      return remove(state, [EXPLORER_SNARKS_GET_SNARKS]);

    case EXPLORER_TRANSACTIONS_GET_TRANSACTIONS_SUCCESS:
      return remove(state, EXPLORER_TRANSACTIONS_GET_TRANSACTIONS);
    case EXPLORER_TRANSACTIONS_CREATE_TX_SUCCESS:
      return remove(state, EXPLORER_TRANSACTIONS_CREATE_TX);
    case EXPLORER_TRANSACTIONS_CLOSE:
      return remove(state, [EXPLORER_TRANSACTIONS_GET_TRANSACTIONS, EXPLORER_TRANSACTIONS_CREATE_TX]);

    case NETWORK_BLOCKS_SET_EARLIEST_BLOCK:
      return remove(state, NETWORK_BLOCKS_GET_EARLIEST_BLOCK);
    case NETWORK_BLOCKS_GET_BLOCKS_SUCCESS:
      return remove(state, NETWORK_BLOCKS_GET_BLOCKS);
    case NETWORK_BLOCKS_CLOSE:
      return remove(state, [NETWORK_BLOCKS_GET_EARLIEST_BLOCK, NETWORK_BLOCKS_GET_BLOCKS]);

    case NETWORK_BLOCKS_IPC_SET_EARLIEST_BLOCK:
      return remove(state, NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK);
    case NETWORK_BLOCKS_IPC_GET_BLOCKS_SUCCESS:
      return remove(state, NETWORK_BLOCKS_IPC_GET_BLOCKS);
    case NETWORK_BLOCKS_IPC_CLOSE:
      return remove(state, [NETWORK_BLOCKS_IPC_GET_EARLIEST_BLOCK, NETWORK_BLOCKS_IPC_GET_BLOCKS]);

    case NETWORK_CONNECTIONS_GET_CONNECTIONS_SUCCESS:
      return remove(state, NETWORK_CONNECTIONS_GET_CONNECTIONS);
    case NETWORK_CONNECTIONS_CLOSE:
      return remove(state, [NETWORK_CONNECTIONS_GET_CONNECTIONS]);

    case NETWORK_GET_FULL_MESSAGE_SUCCESS:
      return remove(state, NETWORK_GET_FULL_MESSAGE);
    case NETWORK_GET_MESSAGE_HEX_SUCCESS:
      return remove(state, NETWORK_GET_MESSAGE_HEX);
    case NETWORK_GET_CONNECTION_SUCCESS:
      return remove(state, NETWORK_GET_CONNECTION);
    case NETWORK_CLOSE:
      return remove(state, [NETWORK_GET_FULL_MESSAGE, NETWORK_GET_MESSAGE_HEX, NETWORK_GET_CONNECTION]);

    case SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS:
      return remove(state, SYSTEM_RESOURCES_GET_RESOURCES);
    case SYSTEM_RESOURCES_CLOSE:
      return remove(state, [SYSTEM_RESOURCES_GET_RESOURCES]);

    case TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS:
      return remove(state, TRACING_OVERVIEW_GET_CHECKPOINTS);
    case TRACING_OVERVIEW_CLOSE:
      return remove(state, [TRACING_OVERVIEW_GET_CHECKPOINTS]);

    case TRACING_BLOCKS_GET_TRACES_SUCCESS:
      return remove(state, TRACING_BLOCKS_GET_TRACES);
    case TRACING_BLOCKS_GET_DETAILS_SUCCESS:
      return remove(state, TRACING_BLOCKS_GET_DETAILS);
    case TRACING_BLOCKS_CLOSE:
      return remove(state, [TRACING_BLOCKS_GET_TRACES, TRACING_BLOCKS_GET_DETAILS]);

    case WEB_NODE_WALLET_GET_WALLETS_SUCCESS:
      return remove(state, WEB_NODE_WALLET_GET_WALLETS);
    case WEB_NODE_WALLET_CLOSE:
      return remove(state, [WEB_NODE_WALLET_GET_WALLETS]);

    case WEB_NODE_SHARED_GET_PEERS_SUCCESS:
      return remove(state, WEB_NODE_SHARED_GET_PEERS);
    case WEB_NODE_PEERS_CLOSE:
      return remove(state, [WEB_NODE_SHARED_GET_PEERS]);
    case WEB_NODE_SHARED_GET_LOGS_SUCCESS:
      return remove(state, WEB_NODE_SHARED_GET_LOGS);
    case WEB_NODE_LOGS_CLOSE:
      return remove(state, [WEB_NODE_SHARED_GET_LOGS]);

    default:
      return state;
  }
}

function add(state: LoadingState, action: FeatureAction<any>): LoadingState {
  return [action.type, ...state];
}

function remove(state: LoadingState, type: string | string[]): LoadingState {
  if (Array.isArray(type)) {
    return state.filter(t => !type.includes(t));
  }
  return state.filter(t => t !== type);
}

export const selectLoadingStateLength = (state: MinaState): number => state.loading.length;
