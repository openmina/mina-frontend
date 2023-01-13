import { ErrorHandler, NgModule, Provider } from '@angular/core';
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


export const SENTRY_PROVIDER: Provider = {
  provide: ErrorHandler,
  useValue: Sentry.createErrorHandler(),
};


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
    INTERCEPTOR_PROVIDER,
    THEME_PROVIDER,
    SENTRY_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
