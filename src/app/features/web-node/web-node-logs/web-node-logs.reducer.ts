import { WebNodeLogsState } from '@web-node/web-node-logs/web-node-logs.state';
import { WEB_NODE_LOGS_CLOSE, WEB_NODE_LOGS_SELECT_LOG, WebNodeLogsActions } from '@web-node/web-node-logs/web-node-logs.actions';

const initialState: WebNodeLogsState = {
  activeLog: undefined,
};

export function reducer(state: WebNodeLogsState = initialState, action: WebNodeLogsActions): WebNodeLogsState {
  switch (action.type) {

    case WEB_NODE_LOGS_SELECT_LOG: {
      return {
        ...state,
        activeLog: action.payload,
      };
    }

    case WEB_NODE_LOGS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
