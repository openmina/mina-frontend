import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Directive, inject, OnDestroy } from '@angular/core';
import { FeatureAction } from '@shared/types/store/feature-action.type';
import { ManualDetection } from './manual-detection.class';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, OperatorFunction } from 'rxjs';
import { FunctionIsNotAllowed } from '@ngrx/store/src/models';

type ActionParam<Action extends FeatureAction<any>> =
  Action & FunctionIsNotAllowed<Action, 'Functions are not allowed to be dispatched. Did you forget to call the action creator function?'>;

@UntilDestroy()
@Directive()
export abstract class StoreDispatcher extends ManualDetection implements OnDestroy {

  protected store: Store<MinaState> = inject<Store<MinaState>>(Store<MinaState>);

  protected dispatch<Action extends FeatureAction<any>, P>(actionClass: new (payload?: P) => ActionParam<Action>, payload?: P): void {
    this.store.dispatch<Action>(new actionClass(payload));
  }

  protected select<S>(mapFn: (state: MinaState) => S, callback: (result: S) => void): void;
  protected select<S, R1>(mapFn: (state: MinaState) => S, callback: (result: R1) => void, op1?: OperatorFunction<S, R1>): void;
  protected select<S, R1, R2>(mapFn: (state: MinaState) => S, callback: (result: R2) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>): void;
  protected select<S, R1, R2, R3>(mapFn: (state: MinaState) => S, callback: (result: R3) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>): void;
  protected select<S, R1, R2, R3, R4>(mapFn: (state: MinaState) => S, callback: (result: R4) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>): void;
  protected select<S, R1, R2, R3, R4, R5>(mapFn: (state: MinaState) => S, callback: (result: R5) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>): void;
  protected select<S, R1, R2, R3, R4, R5, R6>(mapFn: (state: MinaState) => S, callback: (result: R6) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>, op6?: OperatorFunction<R5, R6>): void;
  protected select<S, R1, R2, R3, R4, R5, R6, R7>(mapFn: (state: MinaState) => S, callback: (result: R7) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>, op6?: OperatorFunction<R5, R6>, op7?: OperatorFunction<R6, R7>): void;
  protected select<S, R1, R2, R3, R4, R5, R6, R7, R8>(mapFn: (state: MinaState) => S, callback: (result: R8) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>, op6?: OperatorFunction<R5, R6>, op7?: OperatorFunction<R6, R7>, op8?: OperatorFunction<R7, R8>): void;
  protected select<S, R1, R2, R3, R4, R5, R6, R7, R8, R9>(mapFn: (state: MinaState) => S, callback: (result: R9) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>, op6?: OperatorFunction<R5, R6>, op7?: OperatorFunction<R6, R7>, op8?: OperatorFunction<R7, R8>, op9?: OperatorFunction<R8, R9>): void;
  protected select<S, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10>(mapFn: (state: MinaState) => S, callback: (result: R10) => void, op1?: OperatorFunction<S, R1>, op2?: OperatorFunction<R1, R2>, op3?: OperatorFunction<R2, R3>, op4?: OperatorFunction<R3, R4>, op5?: OperatorFunction<R4, R5>, op6?: OperatorFunction<R5, R6>, op7?: OperatorFunction<R6, R7>, op8?: OperatorFunction<R7, R8>, op9?: OperatorFunction<R8, R9>, op10?: OperatorFunction<R9, R10>): void {

    let result$: Observable<any> = this.store.select<S>(mapFn).pipe(untilDestroyed(this));

    if (op1) { result$ = result$.pipe(op1) as Observable<R1>;
      if (op2) { result$ = result$.pipe(op2) as Observable<R2>;
        if (op3) { result$ = result$.pipe(op3) as Observable<R3>;
          if (op4) { result$ = result$.pipe(op4) as Observable<R4>;
            if (op5) { result$ = result$.pipe(op5) as Observable<R5>;
              if (op6) { result$ = result$.pipe(op6) as Observable<R6>;
                if (op7) { result$ = result$.pipe(op7) as Observable<R7>;
                  if (op8) { result$ = result$.pipe(op8) as Observable<R8>;
                    if (op9) { result$ = result$.pipe(op9) as Observable<R9>;
                      if (op10) { result$ = result$.pipe(op10) as Observable<R10>;}}}}}}}}}}

    result$.subscribe((result: R10) => callback(result));
  }

  ngOnDestroy(): void {}
}
