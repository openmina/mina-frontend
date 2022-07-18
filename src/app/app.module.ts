import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule } from 'apollo-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ThemingTestingComponent } from './theming-testing/theming-testing.component';
import { GRAPH_QL_PROVIDER } from '@core/services/graph-ql.service';
import { AccountListComponent } from './account-list/account-list.component';
import { StoreModule } from '@ngrx/store';
import { THEME_PROVIDER } from '@core/services/theme-switcher.service';
import { ChartComponent } from './chart-component/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ThemingTestingComponent,
    AccountListComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRouting,
    HttpClientModule,
    ApolloModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    GRAPH_QL_PROVIDER,
    THEME_PROVIDER,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
