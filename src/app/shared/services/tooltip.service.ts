import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TooltipService {

  openTooltipsWithClipboardClick: number[] = [];

  readonly onTooltipChange$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  private readonly tooltipDisabledKey: string = 'tooltipDisabled';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.setInitialTooltipBehaviour();
    this.appendTooltipContainerToDOM();
  }

  private appendTooltipContainerToDOM(): void {
    const popup = this.document.createElement('div');
    popup.setAttribute('id', 'mina-tooltip');
    this.document.body.appendChild(popup);
  }

  private setInitialTooltipBehaviour(): void {
    if (localStorage.getItem(this.tooltipDisabledKey) === null) {
      localStorage.setItem(this.tooltipDisabledKey, JSON.stringify(false));
    }
  }

  toggleTooltips(): void {
    const tooltipDisabled = this.getTooltipDisabledSetting();
    localStorage.setItem(this.tooltipDisabledKey, JSON.stringify(!tooltipDisabled));
    this.onTooltipChange$.next(!tooltipDisabled);
  }

  getTooltipDisabledSetting(): boolean {
    return !!JSON.parse(localStorage.getItem(this.tooltipDisabledKey));
  }
}
