import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { SizePipe } from './pipes/size.pipe';
import { TruncateMidPipe } from './pipes/truncate-mid.pipe';
import { SecDurationPipe } from './pipes/sec-duration.pipe';
import { ThousandPipe } from '@shared/pipes/thousand.pipe';
import { EagerSharedModule } from '@shared/eager-shared.module';
import { ReadableDatePipe } from '@shared/pipes/readable-date.pipe';
import { PluralPipe } from '@shared/pipes/plural.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';


const PIPES = [
  SizePipe,
  TruncateMidPipe,
  SecDurationPipe,
  ThousandPipe,
  ReadableDatePipe,
  PluralPipe,
  SafeHtmlPipe,
];

const MODULES = [
  EagerSharedModule,
  MatExpansionModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [
    ...PIPES,
  ],
  imports: [
    ...MODULES,
  ],
  exports: [
    ...MODULES,
    ...PIPES,
  ],
})
export class SharedModule {}
