import { Directive, ElementRef, HostListener, Inject, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { DOCUMENT } from '@angular/common';
import { MinaTooltipDirective } from '@shared/directives/mina-tooltip.directive';
import { TooltipService } from '@shared/services/tooltip.service';

@Directive({
  selector: '[copyToClipboard]',
})
export class CopyToClipboardDirective {

  @Input() copyToClipboard: string;

  private popup: HTMLDivElement = this.document.getElementById('mina-tooltip') as HTMLDivElement;

  constructor(private el: ElementRef<HTMLElement>,
              @Inject(DOCUMENT) private document: Document,
              private tooltipService: TooltipService,
              private clipboard: Clipboard) { }

  @HostListener('click')
  private onClick(): void {
    this.clipboard.copy(this.copyToClipboard);
    this.tooltipService.openTooltipsWithClipboardClick.push(0);
    MinaTooltipDirective.showTooltip(this.popup, this.el.nativeElement, 'Copied to clipboard', 250);

    setTimeout(() => {
      this.tooltipService.openTooltipsWithClipboardClick.pop();
      if (this.tooltipService.openTooltipsWithClipboardClick.length === 0) {
        MinaTooltipDirective.hideTooltip(this.popup);
      }
    }, 1500);
  }
}
