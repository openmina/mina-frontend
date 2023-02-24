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

  @Input() tooltip: string | number = '';
  @Input() showDelay: number = 0;
  @Input() hideDelay: number = 0;
  @Input() tooltipDisabled: boolean = false;
  @Input() globalTooltip: boolean = true;
  @Input() cancelFormatting: boolean = false;
  @Input() maxWidth: number = 250;

  private popup: HTMLDivElement = this.document.getElementById('mina-tooltip') as HTMLDivElement;
  private timer: any;
  private cancelShowing: boolean = false;

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
      if (!this.cancelShowing) {
        MinaTooltipDirective.showTooltip(this.popup, this.el.nativeElement, this.tooltip.toString(), this.maxWidth);
        if (this.cancelFormatting) {
          this.popup.classList.add('cancel-formatting');
        }
      }
    }, this.showDelay);
  }

  @HostListener('mouseleave')
  private onMouseLeave(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    setTimeout(() => MinaTooltipDirective.hideTooltip(this.popup), this.hideDelay);
  }

  ngOnDestroy(): void {
    this.cancelShowing = true;
    MinaTooltipDirective.hideTooltip(this.popup);
  }

  static showTooltip(popup: HTMLDivElement, nativeElement: HTMLElement, message: string, maxWidth: number): void {
    popup.innerHTML = message;
    const boundingClientRect = nativeElement.getBoundingClientRect();
    let x = boundingClientRect.left + (nativeElement.offsetWidth / 2) - (popup.offsetWidth / 2);
    let y = boundingClientRect.top + nativeElement.offsetHeight + TOOLTIP_OFFSET;

    let pos: 'top' | 'bottom' = 'top';
    if ((y + popup.offsetHeight) > window.innerHeight) {
      y = boundingClientRect.top - popup.offsetHeight - TOOLTIP_OFFSET;
      pos = 'bottom';
    }

    if ((x + popup.offsetWidth) > window.innerWidth) {
      x = window.innerWidth - popup.offsetWidth - TOOLTIP_OFFSET;
    } else if (x < 0) {
      x = TOOLTIP_OFFSET;
    }

    popup.style.maxWidth = maxWidth + 'px';
    popup.style.top = y.toString() + 'px';
    popup.style.left = x.toString() + 'px';
    popup.style.animationName = `tooltip-slide-${pos}`;
  }

  static hideTooltip(popup: HTMLDivElement): void {
    if (popup) {
      popup.setAttribute('style', 'top:-1000px;left-1000px');
    }
  }
}
