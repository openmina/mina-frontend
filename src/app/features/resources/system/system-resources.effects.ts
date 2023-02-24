import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { catchError, EMPTY, map, repeat, switchMap } from 'rxjs';
import { addErrorObservable } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  SYSTEM_RESOURCES_CLOSE,
  SYSTEM_RESOURCES_GET_RESOURCES,
  SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS,
  SystemResourcesActions,
  SystemResourcesClose,
  SystemResourcesGetResources,
} from '@resources/system/system-resources.actions';
import { SystemResourcesService } from '@resources/system/system-resources.service';
import { SystemResourcesChartData } from '@shared/types/resources/system/system-resources-chart-data.type';

@Injectable({
  providedIn: 'root',
})
export class SystemResourcesEffects extends MinaBaseEffect<SystemResourcesActions> {

  readonly getResources$: Effect;

  constructor(private actions$: Actions,
              private systemResourcesService: SystemResourcesService,
              store: Store<MinaState>) {

    super(store, selectMinaState);

    this.getResources$ = createEffect(() => this.actions$.pipe(
      ofType(SYSTEM_RESOURCES_GET_RESOURCES, SYSTEM_RESOURCES_CLOSE),
      this.latestActionState<SystemResourcesGetResources | SystemResourcesClose>(),
      switchMap(({ action }) =>
        action.type === SYSTEM_RESOURCES_CLOSE
          ? EMPTY
          : this.systemResourcesService.getResources().pipe(
            map((payload: SystemResourcesChartData) => ({ type: SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS, payload })),
          ),
      ),
      catchError((error: Error) => addErrorObservable(error, MinaErrorType.GRAPH_QL)),
      repeat(),
    ));
  }
}
