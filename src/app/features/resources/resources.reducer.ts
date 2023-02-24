import { combineReducers } from '@ngrx/store';
import { ResourcesState } from '@resources/resources.state';
import { SystemResourcesAction, SystemResourcesActions } from '@resources/system/system-resources.actions';
import * as fromSystemResources from '@system-resources/system-resources.reducer';

export type ResourcesActions = SystemResourcesActions;
export type ResourcesAction = SystemResourcesAction;

export const reducer = combineReducers<ResourcesState, ResourcesActions>({
  systemResources: fromSystemResources.reducer,
});
