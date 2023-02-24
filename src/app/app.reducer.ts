import {
  APP_ADD_NODE,
  APP_CHANGE_ACTIVE_NODE,
  APP_CHANGE_MENU_COLLAPSING,
  APP_CHANGE_SUB_MENUS,
  APP_GET_NODE_STATUS_SUCCESS,
  APP_INIT,
  APP_TOGGLE_MENU_OPENING,
  APP_TOGGLE_MOBILE,
  APP_UPDATE_DEBUGGER_STATUS,
} from '@app/app.actions';
import { AppState } from '@app/app.state';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { CONFIG } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';


const initialState: AppState = {
  nodeStatus: {
    blockLevel: undefined,
    status: AppNodeStatusTypes.CONNECTING,
    timestamp: 0,
  },
  debuggerStatus: {
    isOnline: false,
    failed: undefined,
  },
  menu: {
    collapsed: JSON.parse(localStorage.getItem('menu_collapsed')) || false,
    isMobile: false,
    open: true,
  },
  subMenus: [],
  nodes: [],
  activeNode: undefined,
};

export function reducer(state: AppState = initialState, action: any): AppState {
  switch (action.type) {

    case APP_INIT: {
      return {
        ...state,
        nodes: CONFIG.configs,
        activeNode: CONFIG.configs.find(c => c.name === action.payload.nodeName) || CONFIG.configs[0],
      };
    }

    case APP_CHANGE_ACTIVE_NODE: {
      return {
        ...state,
        activeNode: action.payload,
      };
    }

    case APP_GET_NODE_STATUS_SUCCESS: {
      return {
        ...state,
        nodeStatus: action.payload,
      };
    }

    case APP_UPDATE_DEBUGGER_STATUS: {
      return {
        ...state,
        debuggerStatus: {
          isOnline: action.payload.isOnline !== undefined ? action.payload.isOnline : state.debuggerStatus.isOnline,
          failed: action.payload.failed !== undefined ? action.payload.failed : state.debuggerStatus.failed,
        },
      };
    }

    case APP_CHANGE_MENU_COLLAPSING: {
      localStorage.setItem('menu_collapsed', JSON.stringify(action.payload));
      return {
        ...state,
        menu: {
          ...state.menu,
          collapsed: action.payload,
        },
      };
    }

    case APP_CHANGE_SUB_MENUS: {
      return {
        ...state,
        subMenus: action.payload.filter(Boolean),
      };
    }

    case APP_TOGGLE_MOBILE: {
      return {
        ...state,
        menu: {
          ...state.menu,
          isMobile: action.payload.isMobile,
          open: !action.payload.isMobile,
        },
      };
    }

    case APP_TOGGLE_MENU_OPENING: {
      return {
        ...state,
        menu: {
          ...state.menu,
          open: !state.menu.open,
        },
      };
    }

    case APP_ADD_NODE: {
      const newNode: MinaNode = {
        backend: action.payload,
        features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'web-node'],
        name: action.payload.split('/')[action.payload.split('/').length - 1] || ('custom-node' + ++state.nodes.filter(n => n.name.includes('custom-node')).length),
      };
      return {
        ...state,
        nodes: [newNode, ...state.nodes],
      };
    }

    default:
      return state;
  }
}
