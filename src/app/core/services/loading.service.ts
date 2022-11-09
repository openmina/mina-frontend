import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingEvent } from '@shared/types/core/loading/loading-event.type';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  private readonly loadingMap: Map<string, boolean> = new Map<string, boolean>();

  readonly loadingSub$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly progressLoadingSub$: BehaviorSubject<LoadingEvent> = new BehaviorSubject<LoadingEvent>({ percentage: 0 });

  setLoading(loading: boolean, url: string): void {
    if (loading) {
      this.loadingMap.set(url, loading);
      this.loadingSub$.next(true);
    } else if (!loading && this.loadingMap.has(url)) {
      this.loadingMap.delete(url);
    }
    if (this.loadingMap.size === 0) {
      this.loadingSub$.next(false);
    }
  }

  setProgress(event: LoadingEvent): void {
    this.progressLoadingSub$.next(event);
  }
}
