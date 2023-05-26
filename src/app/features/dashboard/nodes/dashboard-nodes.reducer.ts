import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNodeCount } from '@shared/types/dashboard/node-list/dashboard-node-count.type';
import {
  DASHBOARD_NODES_CLOSE,
  DASHBOARD_NODES_GET_FORKS_SUCCESS,
  DASHBOARD_NODES_GET_NODE_SUCCESS,
  DASHBOARD_NODES_GET_NODES,
  DASHBOARD_NODES_GET_TRACES_SUCCESS,
  DASHBOARD_NODES_INIT,
  DASHBOARD_NODES_SET_ACTIVE_BLOCK,
  DASHBOARD_NODES_SET_ACTIVE_NODE,
  DASHBOARD_NODES_SET_EARLIEST_BLOCK,
  DASHBOARD_NODES_SORT,
  DASHBOARD_NODES_TOGGLE_FILTER,
  DASHBOARD_NODES_TOGGLE_LATENCY,
  DASHBOARD_NODES_TOGGLE_NODES_SHOWING,
  DashboardNodesActions,
} from '@dashboard/nodes/dashboard-nodes.actions';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { CONFIG } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { DashboardForkFilter } from '@shared/types/dashboard/node-list/dashboard-fork-filter.type';

const initialState: DashboardNodesState = {
  nodes: [],
  filteredNodes: [],
  nodeCount: {} as DashboardNodeCount,
  showOfflineNodes: true,
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
  remainingOngoingRequests: 0,
  forks: [],
  activeForkFilter: undefined,
};

export function reducer(state: DashboardNodesState = initialState, action: DashboardNodesActions): DashboardNodesState {
  switch (action.type) {

    case DASHBOARD_NODES_INIT: {
      const name = (node: string) => {
        let org = origin;
        let url: string;
        if (org.includes('localhost:4200')) {
          const strings = node.split('/');
          url = '/' + strings[strings.length - 1];
        } else {
          url = node.replace(org, '');
        }
        return `${url}/graphql`;
      };

      const nodes = sortNodes(CONFIG.configs.map((node: MinaNode) => {
        return ({
          ...{} as any,
          url: node.graphql + '/graphql',
          tracingUrl: node['tracing-graphql'] + '/graphql',
          name: name(node.graphql),
          status: AppNodeStatusTypes.OFFLINE,
          forks: [],
        });
      }), state.sort);
      const nodeCount: DashboardNodeCount = getNodeCount(nodes);
      return {
        ...state,
        nodes,
        filteredNodes: !state.showOfflineNodes ? getActiveNodes(nodes) : nodes,
        nodeCount,
        remainingOngoingRequests: nodes.length,
      };
    }

    case DASHBOARD_NODES_GET_NODE_SUCCESS: {
      const otherNodes = action.payload[0] ? state.nodes.filter(n => n.url !== action.payload[0].url) : state.nodes;
      const newNodes = [...otherNodes, ...action.payload].map((n, index) => ({ ...n, index }));
      const sortedNodes = sortNodes(newNodes, state.sort);
      const nodes = applyNewLatencies(sortedNodes, state.latencyFromFastest);
      return {
        ...state,
        nodes,
        filteredNodes: !state.showOfflineNodes ? getActiveNodes(nodes) : nodes,
        allFilters: Array.from(new Set(nodes.map(n => n.hash).filter(Boolean))),
        remainingOngoingRequests: (state.remainingOngoingRequests - 1) > 0 ? (state.remainingOngoingRequests - 1) : 0,
      };
    }

    case DASHBOARD_NODES_GET_NODES: {
      return {
        ...state,
        forks: initialState.forks,
        activeForkFilter: undefined,
      };
    }

    case DASHBOARD_NODES_GET_FORKS_SUCCESS: {
      if (!action.payload) {
        return {
          ...state,
          forks: undefined,
        };
      }
      const nodes = state.nodes.map(n => ({
        ...n,
        branch: action.payload.find(f => f.name === n.name)?.branch,
        bestTip: action.payload.find(f => f.name === n.name)?.bestTip,
      }));

      const forks = action.payload.reduce((acc: DashboardForkFilter[], fork) => {
        const existingFilter = acc.find((filter) => filter.branch === fork.branch);

        if (existingFilter) {
          if (!existingFilter.candidates.includes(fork.bestTip)) {
            existingFilter.candidates.push(fork.bestTip);
          }
        } else {
          acc.push({
            branch: fork.branch,
            candidates: [fork.bestTip],
          });
        }

        return acc;
      }, []);

      return {
        ...state,
        nodes,
        forks,
        filteredNodes: !state.showOfflineNodes ? getActiveNodes(nodes) : nodes,
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
      const filteredNodes = filterNodes(state.nodes, state.activeForkFilter);
      const showOfflineNodes = !state.showOfflineNodes;
      const filteredNodesByOffline = showOfflineNodes ? sortNodes(filteredNodes, state.sort) : sortNodes(getActiveNodes(filteredNodes), state.sort);
      const nodeCount: DashboardNodeCount = getNodeCount(showOfflineNodes ? filteredNodes : filteredNodes.filter(n => n.status !== AppNodeStatusTypes.OFFLINE));
      return {
        ...state,
        showOfflineNodes: !state.showOfflineNodes,
        filteredNodes: filteredNodesByOffline,
        nodeCount,
      };
    }

    case DASHBOARD_NODES_TOGGLE_LATENCY: {
      const latencyFromFastest = !state.latencyFromFastest;
      return {
        ...state,
        latencyFromFastest,
        filteredNodes: sortNodes(applyNewLatencies(state.filteredNodes, latencyFromFastest), state.sort),
      };
    }

    case DASHBOARD_NODES_TOGGLE_FILTER: {
      // const activeFilters = state.activeFilters.includes(action.payload)
      //   ? state.activeFilters.filter(f => f !== action.payload)
      //   : [...state.activeFilters, action.payload];
      //
      // const showOfflineNodes = state.showOfflineNodes;
      // let filteredNodes = showOfflineNodes ? state.nodes : getActiveNodes(state.nodes);
      // filteredNodes = state.allFilters.length === 0 ? filteredNodes : filterNodes(filteredNodes, activeFilters);
      // filteredNodes = applyNewLatencies(filteredNodes, state.latencyFromFastest);
      // const nodeCount: DashboardNodeCount = getNodeCount(showOfflineNodes ? filteredNodes : filteredNodes.filter(n => n.status !== AppNodeStatusTypes.OFFLINE));
      //
      // return {
      //   ...state,
      //   activeFilters,
      //   filteredNodes,
      //   nodeCount,
      // };

      const filter = action.payload.value === state.activeForkFilter?.value && action.payload.type === state.activeForkFilter?.type
        ? undefined
        : action.payload;
      const showOfflineNodes = state.showOfflineNodes;
      let filteredNodes = showOfflineNodes ? state.nodes : getActiveNodes(state.nodes);
      filteredNodes = filterNodes(filteredNodes, filter);
      filteredNodes = applyNewLatencies(filteredNodes, state.latencyFromFastest);
      const nodeCount: DashboardNodeCount = getNodeCount(showOfflineNodes ? filteredNodes : filteredNodes.filter(n => n.status !== AppNodeStatusTypes.OFFLINE));

      return {
        ...state,
        activeForkFilter: filter,
        filteredNodes,
        nodeCount,
      };
    }

    case DASHBOARD_NODES_SET_ACTIVE_BLOCK: {
      return {
        ...state,
        activeBlock: action.payload.height,
        activeFilters: [],
        remainingOngoingRequests: state.nodes.length,
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
        activeNode: action.payload.node,
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

function getNodeCount<T extends { url: string }>(nodes: T[]): DashboardNodeCount {
  return {
    nodes: new Set(nodes.filter(node => node.url.includes('node')).map(n => n.url)).size,
    producers: new Set(nodes.filter(node => node.url.includes('prod')).map(n => n.url)).size,
    snarkers: new Set(nodes.filter(node => node.url.includes('snarker')).map(n => n.url)).size,
    seeders: new Set(nodes.filter(node => node.url.includes('seed')).map(n => n.url)).size,
    transactionGenerators: new Set(nodes.filter(node => node.url.includes('transaction-generator')).map(n => n.url)).size,
  };
}

function getActiveNodes(nodes: DashboardNode[]): DashboardNode[] {
  return nodes.filter((node: DashboardNode) => node.status !== AppNodeStatusTypes.OFFLINE);
}

function sortNodes(messages: DashboardNode[], tableSort: TableSort<DashboardNode>): DashboardNode[] {
  return sort<DashboardNode>(messages, tableSort, ['addr', 'source', 'status', 'name', 'bestTip', 'branch', 'hash', 'traceStatus'], true);
}

// function filterNodes(nodes: DashboardNode[], activeFilters: string[]): DashboardNode[] {
//   return activeFilters.length > 0 ? nodes.filter(n => activeFilters.includes(n.hash)) : nodes;
// }

function filterNodes(nodes: DashboardNode[], forkFilter: { value: string, type: 'branch' | 'bestTip' }): DashboardNode[] {
  return forkFilter ? nodes.filter(n => n[forkFilter.type] === forkFilter.value) : nodes;
}

function applyNewLatencies(nodes: DashboardNode[], fromFastest: boolean): DashboardNode[] {
  if (nodes.length === 0 || nodes.length === 1) {
    return nodes;
  }
  const fastestTime = nodes.slice().sort((n1, n2) => n1.timestamp - n2.timestamp)[fromFastest ? 0 : 1].timestamp;
  return nodes.map(m => ({
    ...m,
    latency: !m.timestamp ? undefined : (m.timestamp - fastestTime) / ONE_THOUSAND,
  }));
}
