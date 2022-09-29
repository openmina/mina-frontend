import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TooltipService } from '@shared/services/tooltip.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const TOOLTIP_OFFSET = 8;

@UntilDestroy()
@Directive({
  selector: '[tooltip]',
})
export class MinaTooltipDirective implements OnInit, OnDestroy {

  @Input() tooltip: string = '';
  @Input() showDelay: number = 0;
  @Input() hideDelay: number = 0;
  @Input() tooltipDisabled: boolean = false;
  @Input() globalTooltip: boolean = true;

  private popup: HTMLElement = this.document.getElementById('mina-tooltip');
  private timer: number;

  constructor(private el: ElementRef,
              @Inject(DOCUMENT) private document: Document,
              private tooltipService: TooltipService) {}

  ngOnInit(): void {
    if (this.globalTooltip) {
      this.tooltipDisabled = this.tooltipService.getTooltipDisabledSetting();
    }

    this.tooltipService.onTooltipChange$
      .asObservable()
      .pipe(untilDestroyed(this))
      .subscribe(value => this.tooltipDisabled = value);
  }

  @HostListener('mouseenter')
  private onMouseEnter(): void {
    if (this.tooltipDisabled || !this.tooltip) {
      return;
    }
    this.timer = setTimeout(() => {
      this.popup.innerHTML = this.tooltip;
      const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
      let x = boundingClientRect.left + (this.el.nativeElement.offsetWidth / 2) - (this.popup.offsetWidth / 2);
      let y = boundingClientRect.top + this.el.nativeElement.offsetHeight + TOOLTIP_OFFSET;

      let pos: 'top' | 'bottom' = 'top';
      if ((y + this.popup.offsetHeight) > window.innerHeight) {
        y = boundingClientRect.top - this.popup.offsetHeight - TOOLTIP_OFFSET;
        pos = 'bottom';
      }

      if ((x + this.popup.offsetWidth) > window.innerWidth) {
        x = window.innerWidth - this.popup.offsetWidth - TOOLTIP_OFFSET;
      } else if (x < 0) {
        x = TOOLTIP_OFFSET;
      }

      this.showTooltip(x, y, pos);
    }, this.showDelay);
  }

  @HostListener('mouseleave')
  private onMouseLeave(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    setTimeout(() => this.hideTooltip(), this.hideDelay);
  }

  private showTooltip(x: number, y: number, position: 'top' | 'bottom'): void {
    this.popup.style.top = y.toString() + 'px';
    this.popup.style.left = x.toString() + 'px';
    this.popup.style.animationName = `tooltip-slide-${position}`;
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }

  private hideTooltip(): void {
    if (this.popup) {
      this.popup.setAttribute('style', 'top:-1000px;left-1000px');
    }
  }
}
