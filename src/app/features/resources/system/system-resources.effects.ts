import { Injectable } from '@angular/core';
import { MinaState, selectMinaState } from '@app/app.setup';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MinaBaseEffect } from '@shared/base-classes/mina-base.effect';
import { Effect } from '@shared/types/store/effect.type';
import { delay, EMPTY, filter, map, switchMap } from 'rxjs';
import { catchErrorAndRepeat } from '@shared/constants/store-functions';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';
import {
  SYSTEM_RESOURCES_CLOSE,
  SYSTEM_RESOURCES_GET_RESOURCES,
  SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS,
  SYSTEM_RESOURCES_REDRAW_CHARTS,
  SYSTEM_RESOURCES_SET_ACTIVE_POINT,
  SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL,
  SystemResourcesActions,
  SystemResourcesClose,
  SystemResourcesGetResources,
  SystemResourcesSetActivePoint,
} from '@resources/system/system-resources.actions';
import { SystemResourcesService } from '@resources/system/system-resources.service';
import { SystemResourcesChartData } from '@shared/types/resources/system/system-resources-chart-data.type';

@Injectable({
  providedIn: 'root',
})
export class SystemResourcesEffects extends MinaBaseEffect<SystemResourcesActions> {

  readonly getResources$: Effect;
  readonly redrawCharts$: Effect;
  readonly toggleSidePanel$: Effect;

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
      catchErrorAndRepeat(MinaErrorType.GENERIC, SYSTEM_RESOURCES_GET_RESOURCES_SUCCESS),
    ));

    this.toggleSidePanel$ = createEffect(() => this.actions$.pipe(
      ofType(SYSTEM_RESOURCES_SET_ACTIVE_POINT),
      this.latestActionState<SystemResourcesSetActivePoint>(),
      filter(({ state }) => !state.resources.systemResources.sidePanelOpen),
      map(() => ({ type: SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL })),
    ));

    this.redrawCharts$ = createEffect(() => this.actions$.pipe(
      ofType(SYSTEM_RESOURCES_TOGGLE_SIDE_PANEL),
      delay(420),
      map(() => ({ type: SYSTEM_RESOURCES_REDRAW_CHARTS })),
    ));

  }
}
