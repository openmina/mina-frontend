import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { HorizontalResizeDirective } from '@shared/components/horizontal-resizable-container-old/horizontal-resize.directive';

@Component({
  selector: 'mina-horizontal-resizable-container-old',
  templateUrl: './horizontal-resizable-container-old.component.html',
  styleUrls: ['./horizontal-resizable-container-old.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [HorizontalResizeDirective],
})
export class HorizontalResizableContainerOldComponent {

  @Input() minWidth: number | null = null;
  @Input() maxWidthElement: HTMLElement | null = null;
  @Input() localStorageKey: string;
  @Output() widthChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() startResizing: EventEmitter<void> = new EventEmitter<void>();
  @Output() endResizing: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('style.width.px')
  width: number | null = null;

  onResize(width: number): void {
    this.width = width;
    localStorage.setItem(this.localStorageKey, width.toString());
    this.widthChange.emit(width);
  }

  onStartResizing(): void {
    this.startResizing.emit();
  }

  onEndResizing(): void {
    this.endResizing.emit();
  }
}