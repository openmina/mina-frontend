import { Store } from '@ngrx/store';
import { Selector } from '@ngrx/store/src/models';
import { OperatorFunction } from 'rxjs';
import { FeatureAction } from '../types/store/feature-action.type';
import { selectActionAndState, selectLatestStateSlice } from '@shared/constants/store-functions';
import { MinaState } from '@app/app.setup';

export abstract class MinaBaseEffect<A extends FeatureAction<any>> {

  protected readonly latestActionState = <Action extends A>(): OperatorFunction<Action, { action: Action; state: MinaState; }> => selectActionAndState<MinaState, Action>(this.store, this.selector);
  protected readonly latestStateSlice = <Slice, Action extends A>(path: string): OperatorFunction<Action, Slice> => selectLatestStateSlice<Slice, MinaState, Action>(this.store, this.selector, path);

  protected constructor(protected store: Store<MinaState>,
                        private selector: Selector<MinaState, any>) { }
}
