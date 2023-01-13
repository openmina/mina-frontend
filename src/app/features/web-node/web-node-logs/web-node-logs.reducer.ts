import { WebNodeLogsState } from '@web-node/web-node-logs/web-node-logs.state';
import { WEB_NODE_LOGS_CLOSE, WEB_NODE_LOGS_SELECT_LOG, WebNodeLogsActions } from '@web-node/web-node-logs/web-node-logs.actions';
import { WebNodeLog } from '@shared/types/web-node/logs/web-node-log.type';

const initialState: WebNodeLogsState = {
  activeLog: undefined,
};

export function reducer(state: WebNodeLogsState = initialState, action: WebNodeLogsActions): WebNodeLogsState {
  switch (action.type) {

    case WEB_NODE_LOGS_SELECT_LOG: {
      const activeLog: WebNodeLog = !action.payload ? action.payload : {
        ...action.payload,
        data: {
          ...typeof action.payload.data === 'object' ? action.payload.data : JSON.parse(action.payload.data),
        },
      };
      if (action.payload?.data.message) {
        activeLog.data.message = JSON.parse(action.payload.data.message);
      }

      return {
        ...state,
        activeLog,
      };
    }

    case WEB_NODE_LOGS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
