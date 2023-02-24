import { Injectable, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';

const SKIPPED_URLS: string[] = [
  '/messages?limit=',
  '/connections?limit=',
  '/connection/',
  '/blocks?',
  '/version',
  '/aggregator/block/',
];

@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoadingIndication: boolean = request.url.includes('/graphql') || SKIPPED_URLS.some(url => request.url.includes(url));
    if (skipLoadingIndication) {
      return next.handle(request);
    }
    this.loadingService.addURL();

    return next.handle(request)
      .pipe(
        finalize(() => this.loadingService.removeURL()),
      );
  }
}

export const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoadingInterceptor,
  multi: true,
};
