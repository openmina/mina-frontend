import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MinaJsonViewerComponent } from './components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTabsModule } from '@angular/material/tabs';
import { HorizontalResizeDirective } from './directives/horizontal-resize.directive';
import { HorizontalResizableContainerComponent } from './components/horizontal-resizable-container/horizontal-resizable-container.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { SizePipe } from './pipes/size.pipe';
import { MinaTooltipDirective } from './directives/mina-tooltip.directive';
import { TruncateMidPipe } from './pipes/truncate-mid.pipe';
import { SecDurationPipe } from './pipes/sec-duration.pipe';
import { ThousandPipe } from '@shared/pipes/thousand.pipe';

const EAGER_MODULES = [
  CommonModule,
  MatSidenavModule,
  FlexLayoutModule,
  MatButtonToggleModule,
  OverlayModule,
];

const EAGER_DIRECTIVES = [
  ClickOutsideDirective,
  MinaTooltipDirective,
];

/* The role of this module is to eagerly load all modules required by app.component */
@NgModule({
  imports: [
    ...EAGER_MODULES,
  ],
  exports: [
    ...EAGER_MODULES,
    ...EAGER_DIRECTIVES,
  ],
  declarations: [
    ...EAGER_DIRECTIVES,
  ],
})
export class EagerLoadedSharedModule {}

const COMPONENTS = [
  MinaJsonViewerComponent,
  HorizontalResizableContainerComponent,
];

const DIRECTIVES = [
  HorizontalResizeDirective,
];

const PIPES = [
  SizePipe,
  TruncateMidPipe,
  SecDurationPipe,
  ThousandPipe,
];

const MODULES = [
  EagerLoadedSharedModule,
  ScrollingModule,
  MatExpansionModule,
  ClipboardModule,
  MatTabsModule,
  NgxJsonViewerModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
})
export class SharedModule {}

