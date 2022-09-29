import { ErrorPreviewState } from '@error-preview/error-preview.state';
import { ADD_ERROR, ErrorPreviewActions } from '@app/layout/error-preview/error-preview.actions';
import { toReadableDate } from '@shared/helpers/date.helper';

const initialState: ErrorPreviewState = {
  errors: [],
};

export function reducer(state: ErrorPreviewState = initialState, action: ErrorPreviewActions): ErrorPreviewState {
  switch (action.type) {

    case ADD_ERROR: {
      return {
        ...state,
        errors: [{ ...action.payload, timestamp: toReadableDate(action.payload.timestamp, 'HH:mm:ss') }, ...state.errors],
      };
    }

    default:
      return state;
  }
}
