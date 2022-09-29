import { ChangeDetectionStrategy, Component, ComponentRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectErrorPreviewErrors } from '@error-preview/error-preview.state';
import { filter, take } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ErrorListComponent } from '@error-preview/error-list/error-list.component';

@Component({
  selector: 'mina-error-preview',
  templateUrl: './error-preview.component.html',
  styleUrls: ['./error-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPreviewComponent extends ManualDetection implements OnInit {

  errors: any[] = [];
  newMessages: void[] = [];
  newError: any;

  private overlayRef: OverlayRef;
  private errorListComponent: ComponentRef<ErrorListComponent>;

  constructor(private store: Store<MinaState>,
              private overlay: Overlay) { super(); }

  ngOnInit(): void {
    this.listenToNewErrors();
  }

  private listenToNewErrors(): void {
    this.store.select(selectErrorPreviewErrors)
      .pipe(
        filter(errors => !!errors.length),
      )
      .subscribe((errors: any[]) => {
        this.newError = errors[0];
        this.errors = errors;
        this.newMessages.push(void 0);
        setTimeout(() => {
          this.newMessages.pop();
          this.detect();
        }, 3000);
        this.detect();
      });
  }

  openErrorList(anchor: HTMLSpanElement, $event: MouseEvent): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(anchor)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: 0,
          offsetY: 14,
        }]),
    });
    $event.stopPropagation();

    const portal = new ComponentPortal(ErrorListComponent);
    this.errorListComponent = this.overlayRef.attach<ErrorListComponent>(portal);
    this.errorListComponent.instance.errors = this.errors;
    this.errorListComponent.instance.onConfirm
      .pipe(take(1))
      .subscribe(() => this.detachOverlay());
  }

  private detachOverlay(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }
}
