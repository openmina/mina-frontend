import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DswDashboardLedger } from '@shared/types/dsw/dashboard/dsw-dashboard-ledger.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'mina-dsw-dashboard-ledgers',
  templateUrl: './dsw-dashboard-ledgers.component.html',
  styleUrls: ['./dsw-dashboard-ledgers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'd-flex w-100' },
})
export class DswDashboardLedgersComponent {

  @Input() ledgers: DswDashboardLedger;

  readonly secConfig: SecDurationConfig = {
    onlySeconds: false,
    color: false,
    undefinedAlternative: '-',
  };

  @ViewChild('tooltipRef') private tooltipRef: TemplateRef<{ start: number, end: number }>;
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private viewContainerRef: ViewContainerRef) { }

  show(event: MouseEvent, start: number, end: number): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(event.target as HTMLElement)
        .withPositions([{
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 35,
        }]),
    });
    event.stopPropagation();

    const context = this.tooltipRef
      .createEmbeddedView({ start, end })
      .context;
    const portal = new TemplatePortal(this.tooltipRef, this.viewContainerRef, context);
    this.overlayRef.attach(portal);
  }

  hide(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
