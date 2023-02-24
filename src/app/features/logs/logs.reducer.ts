import { LogsState } from '@logs/logs.state';
import { LOGS_CLOSE, LOGS_GET_LOGS_SUCCESS, LOGS_SET_ACTIVE_LOG, LogsActions } from '@logs/logs.actions';

const initialState: LogsState = {
  logs: [],
  activeLog: null,
};

export function reducer(state: LogsState = initialState, action: LogsActions): LogsState {
  switch (action.type) {

    case LOGS_GET_LOGS_SUCCESS: {
      return {
        ...state,
        logs: action.payload,
      }
    }

    case LOGS_SET_ACTIVE_LOG: {
      return {
        ...state,
        activeLog: action.payload,
      }
    }

    case LOGS_CLOSE:
      return initialState;

    default:
      return state;
  }
}
