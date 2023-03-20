import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { OverlayModule } from '@angular/cdk/overlay';
import { ClickOutsideDirective } from '@shared/directives/click-outside.directive';
import { MinaTooltipDirective } from '@shared/directives/mina-tooltip.directive';
import { NgModule } from '@angular/core';

const EAGER_MODULES = [
  CommonModule,
  MatSidenavModule,
  MatButtonToggleModule,
  OverlayModule,
];

const EAGER_DIRECTIVES = [
  ClickOutsideDirective,
  MinaTooltipDirective,
];

/* The role of this module is to eagerly load all shared parts that are also required by app.component */
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
export class EagerSharedModule {}
