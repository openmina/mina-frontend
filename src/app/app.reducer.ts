import {
  APP_CHANGE_ACTIVE_NODE,
  APP_CHANGE_MENU_COLLAPSING,
  APP_CHANGE_SUB_MENUS,
  APP_GET_NODE_STATUS_SUCCESS,
  APP_INIT,
  APP_TOGGLE_MENU_OPENING,
  APP_TOGGLE_MOBILE,
  APP_UPDATE_DEBUGGER_STATUS,
  AppActions,
} from '@app/app.actions';
import { AppState } from '@app/app.state';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { CONFIG } from '@shared/constants/config';


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
        nodes: CONFIG.nodes,
        activeNode: CONFIG.nodes[0],
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
        subMenus: action.payload,
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

    default:
      return state;
  }
}
