import { Directive, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { distinctUntilChanged, filter, fromEvent, map, merge, Observable, Subject, switchMap, takeUntil, tap, throttleTime } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
  selector: '[horizontalResize]',
  standalone: true,
})
export class HorizontalResizeDirective implements OnInit {

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
  private windowResize$: Subject<number> = new Subject<number>();
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
      this.windowResize$.asObservable()
    );
  }

  ngOnInit(): void {
    this.maxWidth = this.maxWidthElement.offsetWidth - 50;

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
          this.windowResize$.next(this.maxWidth);
        } else if (this.maxWidth < currentWidth) {
          this.windowResize$.next(this.maxWidth);
        }
      });
  }
}
