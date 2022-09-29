import { APP_CHANGE_MENU_COLLAPSING, APP_CHANGE_SUB_MENUS, APP_GET_NODE_STATUS_SUCCESS, AppActions } from '@app/app.actions';
import { AppState } from '@app/app.state';
import { AppNodeStatus } from '@shared/types/app/app-node-status.type';


const initialState: AppState = {
  lastBlockLevel: undefined,
  status: AppNodeStatus.CONNECTING,
  timestamp: 0,
  menu: {
    collapsed: JSON.parse(localStorage.getItem('menu_collapsed')) || false,
    isMobile: false,
    open: true,
  },
  subMenus: [],
};

export function reducer(state: AppState = initialState, action: AppActions): AppState {
  switch (action.type) {

    case APP_GET_NODE_STATUS_SUCCESS: {
      return {
        ...state,
        lastBlockLevel: action.payload.lastBlockLevel,
        status: action.payload.status,
        timestamp: action.payload.timestamp,
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

    default:
      return state;
  }
}
