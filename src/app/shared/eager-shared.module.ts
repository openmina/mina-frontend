import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { OverlayModule } from '@angular/cdk/overlay';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { MinaTooltipDirective } from '@shared/directives/mina-tooltip.directive';
import { NgModule } from '@angular/core';
import { CopyComponent } from '@shared/components/copy/copy.component';
import { CopyToClipboardDirective } from '@shared/directives/copy-to-clipboard.directive';

const EAGER_MODULES = [
  CommonModule,
  MatSidenavModule,
  MatButtonToggleModule,
  OverlayModule,
];

const EAGER_DIRECTIVES = [
  ClickOutsideDirective,
  MinaTooltipDirective,
  CopyToClipboardDirective,
];

const EAGER_COMPONENTS = [
  CopyComponent,
];

/* The role of this module is to eagerly load all shared parts that are also required by app.component */
@NgModule({
  imports: [
    ...EAGER_MODULES,
  ],
  exports: [
    ...EAGER_MODULES,
    ...EAGER_DIRECTIVES,
    ...EAGER_COMPONENTS,
  ],
  declarations: [
    ...EAGER_DIRECTIVES,
    ...EAGER_COMPONENTS,
  ],
})
export class EagerSharedModule {}
