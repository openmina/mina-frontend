import { FeatureAction } from '@shared/types/store/feature-action.type';

enum ErrorPreviewActionTypes {
  ADD_ERROR = 'ADD_ERROR',
}

export const ADD_ERROR = ErrorPreviewActionTypes.ADD_ERROR;

export interface ErrorPreviewAction extends FeatureAction<ErrorPreviewActionTypes> {
  readonly type: ErrorPreviewActionTypes;
}

export class ErrorAdd implements ErrorPreviewAction {
  readonly type = ADD_ERROR;

  constructor(public payload?: any) {}
}

export type ErrorPreviewActions =
  | ErrorAdd
  ;
