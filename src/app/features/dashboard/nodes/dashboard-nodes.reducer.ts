import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import {
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_NODES_SUCCESS,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SET_EARLIEST_BLOCK,
  DASHBOARD_NODES_SORT, DASHBOARD_NODES_TOGGLE_FILTER, DASHBOARD_NODES_TOGGLE_LATENCY, DASHBOARD_NODES_TOGGLE_NODES_SHOWING,
  DashboardNodesActions,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';

const initialState: DashboardNodesState = {
  nodes: [],
  filteredNodes: [],
  nodeCount: {} as DashboardNodeCount,
  showOfflineNodes: false,
  latencyFromFastest: false,
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.ASC,
  },
  activeNode: undefined,
  blockTraces: [],
  activeBlock: undefined,
  earliestBlock: undefined,
  allFilters: [],
  activeFilters: [],
};

export function reducer(state: DashboardNodesState = initialState, action: DashboardNodesActions): DashboardNodesState {
  switch (action.type) {
    case DASHBOARD_NODES_GET_NODES_SUCCESS: {
      const sortedNodes = sortNodes(action.payload, state.sort);
      const nodes = applyNewLatencies(sortedNodes, state.latencyFromFastest);
      const nodeCount: DashboardNodeCount = {
        nodes: nodes.filter((node: any) => node.url.includes('node') && node.status === AppNodeStatusTypes.SYNCED).length,
        producers: nodes.filter((node: any) => node.url.includes('prod') && node.status === AppNodeStatusTypes.SYNCED).length,
        snarkers: nodes.filter((node: any) => node.url.includes('snarker') && node.status === AppNodeStatusTypes.SYNCED).length,
        seeders: nodes.filter((node: any) => node.url.includes('seed') && node.status === AppNodeStatusTypes.SYNCED).length,
        transactionGenerators: nodes.filter((node: any) => node.url.includes('transaction-generator') && node.status === AppNodeStatusTypes.SYNCED).length,
      };
      return {
        ...state,
        nodes,
        filteredNodes: filterNodes(nodes),
        nodeCount,
        // allFilters: Array.from(new Set(action.payload.map(n => n.hash))),
      };
    }

    case DASHBOARD_NODES_SORT: {
      return {
        ...state,
        filteredNodes: sortNodes(state.filteredNodes, action.payload),
        sort: { ...action.payload },
      };
    }

    case DASHBOARD_NODES_TOGGLE_NODES_SHOWING: {
      return {
        ...state,
        showOfflineNodes: !state.showOfflineNodes,
        filteredNodes: !state.showOfflineNodes ? sortNodes(state.nodes, state.sort) : sortNodes(filterNodes(state.nodes), state.sort),
      };
    }

    case DASHBOARD_NODES_TOGGLE_LATENCY: {
      return {
        ...state,
        latencyFromFastest: !state.latencyFromFastest,
        filteredNodes: sortNodes(applyNewLatencies(state.filteredNodes, !state.latencyFromFastest), state.sort),
      };
    }
    // case  DASHBOARD_NODES_TOGGLE_FILTER: {
    //   const activeFilters = state.activeFilters.includes(action.payload)
    //     ? state.activeFilters.filter(f => f !== action.payload)
    //     : [...state.activeFilters, action.payload];
    //
    //   const filteredNodes = state.allFilters.length < 2 ? state.nodes : filterNodes(state.nodes, activeFilters);
    //
    //   return {
    //     ...state,
    //     activeFilters,
    //     filteredNodes,
    //   };
    // }

    case DASHBOARD_NODES_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: [],
      };
    }

    case DASHBOARD_NODES_SET_EARLIEST_BLOCK: {
      return {
        ...state,
        earliestBlock: action.payload.height,
      };
    }

    case DASHBOARD_NODES_SET_ACTIVE_NODE: {
      return {
        ...state,
        activeNode: action.payload,
      };
    }

    case DASHBOARD_NODES_GET_TRACES_SUCCESS: {
      return {
        ...state,
        blockTraces: action.payload,
      };
    }

    case DASHBOARD_NODES_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function filterNodes(nodes: DashboardNode[]): DashboardNode[] {
  return nodes.filter((node: DashboardNode) => node.status !== AppNodeStatusTypes.OFFLINE);
}

function sortNodes(messages: DashboardNode[], tableSort: TableSort<DashboardNode>): DashboardNode[] {
  return sort<DashboardNode>(messages, tableSort, ['addr', 'source', 'status', 'name', 'hash'], true);
}
//
// function filterNodes(nodes: DashboardNode[], activeFilters: string[]): DashboardNode[] {
//   return activeFilters.length > 0 ? nodes.filter(n => activeFilters.includes(n.hash)) : nodes;
// }
//
// function sortNodes(messages: DashboardNode[], tableSort: TableSort<DashboardNode>): DashboardNode[] {
//   return sort<DashboardNode>(messages, tableSort, ['addr', 'source', 'status', 'url', 'hash'], true);
// }

function applyNewLatencies(nodes: DashboardNode[], fromFastest: boolean): DashboardNode[] {
  if (nodes.length === 0) {
    return nodes;
  }
  const fastestTime = nodes.slice().sort((n1, n2) => n1.timestamp - n2.timestamp)[fromFastest ? 0 : 1].timestamp;
  return nodes.map(m => ({
    ...m,
    latency: !m.timestamp ? undefined : (m.timestamp - fastestTime) / ONE_THOUSAND,
  }));
}
