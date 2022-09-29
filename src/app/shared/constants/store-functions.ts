import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ObservedValueOf, OperatorFunction } from 'rxjs';
import { Selector } from '@ngrx/store/src/models';
import { withLatestFrom } from 'rxjs/operators';

export const createNonDispatchableEffect = (source: () => any) => createEffect(source, { dispatch: false });

export const selectActionAndState = <S, A>(store: Store<S>, selector: Selector<S, any>): OperatorFunction<A, { action: A; state: S; }> =>
  withLatestFrom(
    store.select<S>(selector),
    (action: A, state: ObservedValueOf<Store<S>>): { action: A, state: S } => ({ action, state }),
  );
