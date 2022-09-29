import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { delay, distinctUntilChanged, filter, fromEvent, map, merge, Observable, Subject, switchMap, takeUntil, tap, throttleTime } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[horizontalResize]',
})
export class HorizontalResizeDirective implements AfterViewInit {

  @Input() minWidth: number | null;
  @Input() maxWidthElement: HTMLElement | null;
  @Input() localStorageKey: string;

  @Output() horizontalResize: Observable<number>;
  @Output() startResizing: EventEmitter<void> = new EventEmitter<void>();
  @Output() endResizing = fromEvent<MouseEvent>(this.document, 'mouseup')
    .pipe(
      filter(() => this.resizeInProgress),
      tap(() => this.resizeInProgress = false),
    );

  private resizeInProgress: boolean;
  private subj = new Subject<number>();
  private maxWidth: number;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              @Inject(ElementRef) private readonly elementRef: ElementRef<HTMLElement>) {

    this.horizontalResize = merge(
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown')
        .pipe(
          tap((e: MouseEvent) => e.preventDefault()),
          switchMap(() => {
            this.startResizing.emit();
            this.resizeInProgress = true;
            const { width, left } = this.elementRef.nativeElement
              .parentElement.parentElement
              .getBoundingClientRect();

            return fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
              map(({ clientX }: { clientX: number }) => {
                const newValue = left + width - clientX;
                if (this.minWidth && this.minWidth > newValue) {
                  return this.minWidth;
                } else if (this.maxWidth && this.maxWidth < newValue) {
                  return this.maxWidth;
                } else {
                  return newValue;
                }
              }),
              distinctUntilChanged(),
              takeUntil(fromEvent(this.document, 'mouseup')),
            );
          }),
        ),
      this.subj.asObservable().pipe(delay(1)),
    );
  }

  ngAfterViewInit(): void {
    this.maxWidth = this.maxWidthElement.offsetWidth - 50;
    const localStorageWidth = Number(localStorage.getItem(this.localStorageKey));
    if (localStorageWidth) {
      this.subj.next(localStorageWidth);
    }

    fromEvent(window, 'resize')
      .pipe(
        untilDestroyed(this),
        throttleTime(50),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.maxWidth = this.maxWidthElement.offsetWidth - 50;
        const currentWidth = Number(localStorage.getItem(this.localStorageKey));
        if (this.maxWidth < this.minWidth) {
          this.maxWidth = this.minWidth;
          this.subj.next(this.maxWidth);
        } else if (this.maxWidth < currentWidth) {
          this.subj.next(this.maxWidth);
        }
      });
  }
}
