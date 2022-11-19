import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {

  readonly windowWidth$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor() {
    this.listenToWindowWidth();
  }

  private listenToWindowWidth(): void {
    fromEvent(window, 'resize')
      .pipe(
        map(() => window.innerWidth),
      )
      .subscribe((width: number) => {
        this.windowWidth$.next(width);
      });
  }
}
