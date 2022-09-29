import { TracingOverviewState } from '@tracing/tracing-overview/tracing-overview.state';
import {
  TRACING_OVERVIEW_CLOSE,
  TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS,
  TRACING_OVERVIEW_SORT,
  TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW,
  TracingOverviewActions,
} from '@tracing/tracing-overview/tracing-overview.actions';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';

const initialState: TracingOverviewState = {
  checkpoints: [],
  sortDirection: SortDirection.DSC,
  condensedView: JSON.parse(localStorage.getItem('condensed_tracing')) || false,
};

export function reducer(state: TracingOverviewState = initialState, action: TracingOverviewActions): TracingOverviewState {
  switch (action.type) {

    case TRACING_OVERVIEW_GET_CHECKPOINTS_SUCCESS: {
      return {
        ...state,
        checkpoints: action.payload,
      };
    }

    case TRACING_OVERVIEW_SORT: {
      return {
        ...state,
        sortDirection: action.payload,
        checkpoints: state.checkpoints.slice().sort((c1: TracingOverviewCheckpoint, c2: TracingOverviewCheckpoint) =>
          action.payload === SortDirection.DSC ? c2.totalTime - c1.totalTime : c1.totalTime - c2.totalTime,
        ),
      };
    }

    case TRACING_OVERVIEW_TOGGLE_CONDENSED_VIEW: {
      localStorage.setItem('condensed_tracing', JSON.stringify(!state.condensedView));
      return {
        ...state,
        condensedView: !state.condensedView,
      };
    }

    case TRACING_OVERVIEW_CLOSE: {
      return initialState;
    }

    default:
      return state;
  }
}
