import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MinaJsonViewerComponent } from './components/custom-components/mina-json-viewer/mina-json-viewer.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTabsModule } from '@angular/material/tabs';
import { HorizontalResizeDirective } from './directives/horizontal-resize.directive';
import { HorizontalResizableContainerComponent } from './components/horizontal-resizable-container/horizontal-resizable-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SizePipe } from './pipes/size.pipe';
import { TruncateMidPipe } from './pipes/truncate-mid.pipe';
import { SecDurationPipe } from './pipes/sec-duration.pipe';
import { ThousandPipe } from '@shared/pipes/thousand.pipe';
import { StepperComponent } from './components/stepper/stepper.component';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';
import { IntervalSelectComponent } from '@shared/components/interval-select/interval-select.component';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ReadableDatePipe } from '@shared/pipes/readable-date.pipe';


const COMPONENTS = [
  MinaJsonViewerComponent,
  HorizontalResizableContainerComponent,
  StepperComponent,
  IntervalSelectComponent,
];

const DIRECTIVES = [
  HorizontalResizeDirective,
  CopyToClipboardDirective,
];

const PIPES = [
  SizePipe,
  TruncateMidPipe,
  SecDurationPipe,
  ThousandPipe,
  ReadableDatePipe,
];

const MODULES = [
  EagerSharedModule,
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

