import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { isDesktop } from '@shared/helpers/values.helper';
import { DswWorkPoolState } from '@dsw/work-pool/dsw-work-pool.state';
import {
  DSW_WORK_POOL_CLOSE,
  DSW_WORK_POOL_GET_WORK_POOL_SUCCESS,
  DSW_WORK_POOL_SET_ACTIVE_WORK_POOL,
  DSW_WORK_POOL_SORT_WORK_POOL,
  DSW_WORK_POOL_TOGGLE_SIDE_PANEL,
  DswWorkPoolActions,
} from '@dsw/work-pool/dsw-work-pool.actions';
import { WorkPool } from '@shared/types/dsw/work-pool/work-pool.type';

const initialState: DswWorkPoolState = {
  workPools: [],
  activeWorkPool: undefined,
  openSidePanel: isDesktop(),
  sort: {
    sortBy: 'timestamp',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswWorkPoolState = initialState, action: DswWorkPoolActions): DswWorkPoolState {
  switch (action.type) {

    case DSW_WORK_POOL_GET_WORK_POOL_SUCCESS: {
      return {
        ...state,
        workPools: action.payload,
      };
    }

    case DSW_WORK_POOL_SET_ACTIVE_WORK_POOL: {
      return {
        ...state,
        activeWorkPool: state.workPools.find(w => w.id === action.payload.id),
      };
    }

    case DSW_WORK_POOL_SORT_WORK_POOL: {
      return {
        ...state,
        sort: action.payload,
        workPools: sortWorkPools(state.workPools, action.payload),
      };
    }

    case DSW_WORK_POOL_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
        activeWorkPool: state.openSidePanel ? undefined : state.activeWorkPool,
      };
    }

    case DSW_WORK_POOL_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function sortWorkPools(events: WorkPool[], tableSort: TableSort<WorkPool>): WorkPool[] {
  return sort<WorkPool>(events, tableSort, ['id']);
}
