import {
  SYSTEM_RESOURCES_CLOSE,
  SYSTEM_RESOURCES_GET_RESOURCES,
  SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS,
  SYSTEM_RESOURCES_SET_ACTIVE_POINT,
  SYSTEM_RESOURCES_SET_ACTIVE_TIME,
  SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH,
  SYSTEM_RESOURCES_SORT_THREADS,
  SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL,
  SystemResourcesActions,
} from '@resources/system/system-resources.actions';
import { SystemResourcesState } from '@resources/system/system-resources.state';
import { SystemResourcesPoint } from '@shared/types/resources/system/system-resources-point.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { SystemResourcesPointThread } from '@shared/types/resources/system/system-resources-sub-point.type';

const totals = ['var(--success-primary)', '#59bfb5'];
const colors = ['#8a3ffc', '#ff7eb6', '#d2a106', '#ba4e00', '#33b1ff', '#fa4d56', '#4589ff', '#08bdba', '#d4bbff', '#007d79', '#fff1f1', '#d12771'];
const colorMapping = {
  cpu: [totals[0], ...colors],
  memory: [totals[0], ...colors],
  io: [...totals, ...colors],
  network: [...totals, ...colors],
};

const initialState: SystemResourcesState = {
  chartData: {
    cpu: [],
    memory: [],
    io: [],
    network: [],
    cpuMax: 0,
    memoryMax: 0,
    ioMax: 0,
    networkMax: 0,
    cpuTitle: 'CPU',
    memoryTitle: 'Memory',
    ioTitle: 'Storage IO',
    networkTitle: 'Network IO',
    cpuUm: '%',
    memoryUm: 'GB',
    ioUm: 'MB/s',
    networkUm: 'MB/s',
  },
  sidePanelOpen: true,
  colorMapping,
  activePoint: undefined,
  activeTime: undefined,
  activeResource: undefined,
  threadsSort: {
    sortBy: 'value',
    sortDirection: SortDirection.DSC,
  },
  sidePanelActivePath: undefined,
  closed: true,
};


export function reducer(state: SystemResourcesState = initialState, action: SystemResourcesActions): SystemResourcesState {
  switch (action.type) {
    case SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS: {
      let pointFromRoute: SystemResourcesPoint;
      if (state.activeTime) {
        pointFromRoute = getClosestPoint(action.payload[state.activeResource], state.activeTime);
      }
      const activePoint = pointFromRoute
        ? {
          point: pointFromRoute,
          title: state.chartData[state.activeResource + 'Title'],
          colors: state.colorMapping[state.activeResource],
          um: state.chartData[state.activeResource + 'Um'],
        }
        : {
          point: action.payload.cpu[action.payload.cpu.length - 1],
          title: 'CPU',
          colors: state.colorMapping.cpu,
          um: '%',
        };

      const sidePanelActivePath = Object.keys(activePoint.point.pathPoints)[0];

      return {
        ...state,
        chartData: {
          ...state.chartData,
          cpu: action.payload.cpu,
          cpuMax: action.payload.cpuMax,
          memory: action.payload.memory,
          memoryMax: action.payload.memoryMax,
          io: action.payload.io,
          ioMax: action.payload.ioMax,
          network: action.payload.network,
          networkMax: action.payload.networkMax,
        },
        activePoint: {
          ...activePoint,
          point: sortThreadsInPoint(activePoint.point, state.threadsSort, sidePanelActivePath),
        },
        sidePanelActivePath,
      };
    }

    case SYSTEM_RESOURCES_SET_ACTIVE_TIME: {
      return {
        ...state,
        activeTime: action.payload.timestamp,
        activeResource: action.payload.resource,
      };
    }

    case SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        sidePanelOpen: !state.sidePanelOpen,
      };
    }

    case SYSTEM_RESOURCES_SET_ACTIVE_POINT: {
      let sidePanelActivePath = state.sidePanelActivePath;
      if (!(sidePanelActivePath in action.payload.point.pathPoints)) {
        sidePanelActivePath = Object.keys(action.payload.point.pathPoints)[0];
      }
      return {
        ...state,
        sidePanelActivePath,
        activePoint: {
          ...action.payload,
          point: sortThreadsInPoint(action.payload.point, state.threadsSort, sidePanelActivePath),
        },
      };
    }

    case SYSTEM_RESOURCES_SORT_THREADS: {
      return {
        ...state,
        activePoint: {
          ...state.activePoint,
          point: sortThreadsInPoint(state.activePoint.point, action.payload, state.sidePanelActivePath),
        },
        threadsSort: action.payload,
      };
    }

    case SYSTEM_RESOURCES_SET_SIDE_PANEL_ACTIVE_PATH: {
      return {
        ...state,
        sidePanelActivePath: action.payload,
        activePoint: {
          ...state.activePoint,
          point: sortThreadsInPoint(state.activePoint.point, state.threadsSort, action.payload),
        },
      };
    }

    case SYSTEM_RESOURCES_GET_RESOURCES: {
      return {
        ...state,
        closed: false,
      };
    }

    case SYSTEM_RESOURCES_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortThreadsInPoint(point: SystemResourcesPoint, sort: TableSort<SystemResourcesPointThread>, activePath: string): SystemResourcesPoint {
  return {
    ...point,
    pathPoints: {
      ...point.pathPoints,
      [activePath]: {
        ...point.pathPoints[activePath],
        taskThreads: sortThreads(point.pathPoints[activePath].taskThreads, sort),
      },
    },
  };
}

function getClosestPoint(points: SystemResourcesPoint[], goal: number): SystemResourcesPoint {
  return points.reduce((prev: SystemResourcesPoint, curr: SystemResourcesPoint) =>
    Math.abs(curr.timestamp - goal) < Math.abs(prev.timestamp - goal) ? curr : prev
  );
}

function sortThreads(threads: SystemResourcesPointThread[], tableSort: TableSort<SystemResourcesPointThread>): SystemResourcesPointThread[] {
  return !threads ? threads : sort(threads, tableSort, ['name']);
}
