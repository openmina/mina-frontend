import { APP_INITIALIZER, ErrorHandler, Injectable, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
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
import { NgrxRouterStoreModule } from '@shared/router/ngrx-router.module';
import * as Sentry from '@sentry/angular';
import { ServerStatusComponent } from './layout/server-status/server-status.component';
import { CONFIG } from '@shared/constants/config';
import { SubmenuTabsComponent } from './layout/submenu-tabs/submenu-tabs.component';
import { INTERCEPTOR_PROVIDER } from '@core/interceptor/loading.interceptor';
import { NodePickerComponent } from './layout/node-picker/node-picker.component';
import { GlobalErrorHandlerService } from '@core/services/global-error-handler.service';
import { Router } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';


export const SENTRY_PROVIDER: Provider = {
  provide: ErrorHandler,
  useValue: Sentry.createErrorHandler(),
};

@Injectable()
export class AppGlobalErrorhandler implements ErrorHandler {
  constructor(private errorHandlerService: GlobalErrorHandlerService) {}

  handleError(error: any) {
    Sentry.captureException(error);
    this.errorHandlerService.handleError(error);
    console.error(error);
  }
}


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ToolbarComponent,
    ErrorPreviewComponent,
    ErrorListComponent,
    ServerStatusComponent,
    SubmenuTabsComponent,
    NodePickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    CONFIG.firebase ? AngularFireModule.initializeApp(CONFIG.firebase) : [],
    CONFIG.firebase ? AngularFireAnalyticsModule : [],
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
    BrowserAnimationsModule,
    EagerSharedModule,
  ],
  providers: [
    SENTRY_PROVIDER,
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
    INTERCEPTOR_PROVIDER,
    THEME_PROVIDER,
    { provide: ErrorHandler, useClass: AppGlobalErrorhandler, deps: [GlobalErrorHandlerService] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
