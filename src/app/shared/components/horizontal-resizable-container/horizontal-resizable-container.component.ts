import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { HorizontalResizeDirective } from '@shared/components/horizontal-resizable-container-old/horizontal-resize.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'mina-horizontal-resizable-container',
  standalone: true,
  imports: [HorizontalResizeDirective, NgTemplateOutlet],
  templateUrl: './horizontal-resizable-container.component.html',
  styleUrls: ['./horizontal-resizable-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-100 h-100 p-relative flex-row' },
})
export class HorizontalResizableContainerComponent implements OnInit, OnChanges {

  @Input() minWidth: number | null = null;
  @Input() maxWidthElement: HTMLElement | null = null;
  @Input() localStorageKey: string;
  @Input() show: boolean;
  @Input() leftTemplate: TemplateRef<void>;
  @Input() rightTemplate: TemplateRef<void>;
  // @Output() widthChange: EventEmitter<number> = new EventEmitter<number>();
  // @Output() startResizing: EventEmitter<void> = new EventEmitter<void>();
  // @Output() endResizing: EventEmitter<void> = new EventEmitter<void>();

  width: number | null = null;

  private removedClass: boolean;

  @ViewChild('main', { static: true }) private main: ElementRef<HTMLElement>;
  @ViewChild('aside', { static: true }) private aside: ElementRef<HTMLElement>;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.show && !this.removedClass) {
      this.removedClass = true;
      this.aside.nativeElement.classList.remove('no-transition');
    }
    this.setDimensions();
  }

  onResize(width: number): void {
    this.width = width;
    localStorage.setItem(this.localStorageKey, width.toString());
    // this.widthChange.emit(width);
    this.setDimensions();
  }

  onStartResizing(): void {
    // this.startResizing.emit();
    this.toggleMain();
  }

  onEndResizing(): void {
    // this.endResizing.emit();
    this.toggleMain();
  }

  private toggleMain(): void {
    this.main.nativeElement.classList.toggle('no-transition');
  }

  private setDimensions(): void {
    this.aside.nativeElement.style.width = `${this.width}px`;
    if (this.show) {
      this.aside.nativeElement.style.right = '0';
      this.main.nativeElement.style.width = `calc(100% - ${this.width}px)`;
    } else {
      this.aside.nativeElement.style.right = `-${this.width}px`;
      this.main.nativeElement.style.width = '100%';
    }
  }
}
