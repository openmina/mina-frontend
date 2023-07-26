import { DswActionsState } from '@dsw/actions/dsw-actions.state';
import {
  DSW_ACTIONS_CLOSE,
  DSW_ACTIONS_GET_ACTIONS,
  DSW_ACTIONS_GET_ACTIONS_SUCCESS,
  DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS,
  DSW_ACTIONS_SEARCH,
  DSW_ACTIONS_SORT,
  DSW_ACTIONS_TOGGLE_SIDE_PANEL,
  DswActionsActions,
} from '@dsw/actions/dsw-actions.actions';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { sort } from '@shared/helpers/array.helper';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';
import { isMobile } from '@shared/helpers/values.helper';

const initialState: DswActionsState = {
  groups: [],
  filteredGroups: [],
  stats: {} as DswActionsStats,
  openSidePanel: !isMobile(),
  activeSlot: undefined,
  earliestSlot: undefined,
  activeSearch: '',
  currentSort: {
    sortBy: 'totalTime',
    sortDirection: SortDirection.DSC,
  },
};

export function reducer(state: DswActionsState = initialState, action: DswActionsActions): DswActionsState {
  switch (action.type) {

    case DSW_ACTIONS_GET_ACTIONS: {
      return {
        ...state,
        activeSlot: action.payload.slot,
      };
    }

    case DSW_ACTIONS_GET_ACTIONS_SUCCESS: {
      const groups = sortGroups(action.payload[1], state.currentSort);
      return {
        ...state,
        groups,
        filteredGroups: searchActionsInGroups(state.activeSearch, groups),
        stats: action.payload[0],
      };
    }

    case DSW_ACTIONS_TOGGLE_SIDE_PANEL: {
      return {
        ...state,
        openSidePanel: !state.openSidePanel,
      };
    }

    case DSW_ACTIONS_GET_EARLIEST_SLOT_SUCCESS: {
      return {
        ...state,
        earliestSlot: action.payload,
      };
    }

    case DSW_ACTIONS_SORT: {
      return {
        ...state,
        currentSort: action.payload,
        filteredGroups: sortGroups(state.filteredGroups, action.payload),
      };
    }

    case DSW_ACTIONS_SEARCH: {
      const groups = searchActionsInGroups(action.payload, state.groups);
      return {
        ...state,
        activeSearch: action.payload,
        filteredGroups: sortGroups(groups, state.currentSort),
      };
    }

    case DSW_ACTIONS_CLOSE:
      return initialState;

    default:
      return state;
  }
}

function searchActionsInGroups(toSearch: string, groups: DswActionGroup[]): DswActionGroup[] {
  return !toSearch
    ? groups.map(group => ({ ...group, display: true }))
    : groups.map(group => {
      return {
        ...group,
        actions: group.actions.map(action => {
          if (action.fullTitle.toLowerCase().includes(toSearch.toLowerCase())) {
            return { ...action, display: true };
          }
          return { ...action, display: false };
        }),
      };
    }).map(group => {
      if (group.actions.some(action => action.display)) {
        return { ...group, display: true };
      }
      return { ...group, display: false };
    });
}

function sortGroups(blocks: DswActionGroup[], tableSort: TableSort<DswActionGroup>): DswActionGroup[] {
  return sort<DswActionGroup>(blocks, tableSort, []);
}
