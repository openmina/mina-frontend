import { SortDirection } from '@shared/types/shared/table-sort.type';
import { SnarkWorkersTracesState } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import {
  SW_TRACES_CLOSE,
  SW_TRACES_GET_JOBS,
  SW_TRACES_SET_ACTIVE_JOB,
  SW_TRACES_SORT,
  SWTracesActions,
} from '@explorer/snark-workers-traces/snark-workers-traces.actions';

const initialState: SnarkWorkersTracesState = {
  jobs: [],
  filter: {
    workers: [],
    from: Date.now() - 3600000,
    to: Date.now(),
  },
  sort: {
    sortDirection: SortDirection.DSC,
    sortBy: 'jobInit',
  },
  activeRow: undefined,
};

export function reducer(state: SnarkWorkersTracesState = initialState, action: SWTracesActions): SnarkWorkersTracesState {
  switch (action.type) {

    case SW_TRACES_GET_JOBS: {
      return {
        ...state,
        filter: {
          ...state.filter,
          ...action.payload,
        },
      };
    }

    case SW_TRACES_SORT: {
      return {
        ...state,
        sort: action.payload,
      };
    }

    case SW_TRACES_SET_ACTIVE_JOB: {
      return {
        ...state,
        activeRow: action.payload,
      };
    }

    case SW_TRACES_CLOSE:
      return initialState;

    default:
      return state;
  }
}
