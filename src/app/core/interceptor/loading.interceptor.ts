import { Injectable, Provider } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { LoadingService } from '@core/services/loading.service';

const SKIPPED_URLS: string[] = [
  '/messages?limit=',
  '/connections?limit=',
  '/connection/',
  '/blocks?',
  '/version',
];

const SKIPPED_GRAPHQL_NAMES: string[] = [
  'blockStatus',
  'pooledUserCommands',
];

@Injectable({
  providedIn: 'root',
})
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipLoadingIndication: boolean = (request.url.includes('/graphql') && SKIPPED_GRAPHQL_NAMES.some(opName => opName === request.body.operationName))
      || SKIPPED_URLS.some(url => request.url.includes(url));

    if (skipLoadingIndication) {
      return next.handle(request);
    }

    this.loadingService.setLoading(true, request.url);

    return next.handle(request)
      .pipe(
        catchError((err, caught: Observable<any>) => {
          this.loadingService.setLoading(false, request.url);
          return caught;
        }),
        map((evt: HttpEvent<any>) => {
          if (evt instanceof HttpResponse
            || (evt.type === HttpEventType.DownloadProgress && evt.total > 10485760)) {
            this.loadingService.setLoading(false, request.url);
          }
          return evt;
        }),
      );
  }
}

export const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: LoadingInterceptor,
  multi: true,
};
