import { ErrorHandler, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountListComponent } from './account-list/account-list.component';
import { StoreModule } from '@ngrx/store';
import { GRAPH_QL_PROVIDER } from '@core/services/graph-ql.service';
import { THEME_PROVIDER } from '@core/services/theme-switcher.service';
import { MenuComponent } from './layout/menu/menu.component';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ToolbarComponent } from './layout/toolbar/toolbar.component';
import { metaReducers, reducers } from '@app/app.setup';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppEffects } from '@app/app.effects';
import { ErrorPreviewComponent } from '@error-preview/error-preview.component';
import { ErrorListComponent } from '@error-preview/error-list/error-list.component';
import { NETWORK_INTERCEPTOR } from '@core/interceptor/loading.interceptor';
import { NgrxRouterStoreModule } from '@shared/router/ngrx-router.module';
import * as Sentry from '@sentry/angular';
import { ServerStatusComponent } from './layout/server-status/server-status.component';
import { CONFIG } from '@shared/constants/config';


export const SENTRY_PROVIDER: Provider = {
  provide: ErrorHandler,
  useValue: Sentry.createErrorHandler(),
};


@NgModule({
  declarations: [
    AppComponent,
    AccountListComponent,
    MenuComponent,
    ToolbarComponent,
    ErrorPreviewComponent,
    ErrorListComponent,
    ServerStatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictActionWithinNgZone: true,
        strictStateSerializability: true,
      },
    }),
    EffectsModule.forRoot([AppEffects]),
    NgrxRouterStoreModule,
    !CONFIG.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
    HttpClientModule,
    ApolloModule,
    BrowserAnimationsModule,
    EagerSharedModule,
  ],
  providers: [
    GRAPH_QL_PROVIDER,
    THEME_PROVIDER,
    NETWORK_INTERCEPTOR,
    SENTRY_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
