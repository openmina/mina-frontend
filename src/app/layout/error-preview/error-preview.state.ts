import { MinaState } from '@app/app.setup';

export class ErrorPreviewState {
  errors: any[];
}

export const selectErrorPreviewErrors = (state: MinaState) => state.error.errors;
