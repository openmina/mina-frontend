import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { CONFIG } from '@shared/constants/config';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

if (CONFIG.production) {
  enableProdMode();
  initSentry();
}


platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

function initSentry(): void {
  if (CONFIG.sentry) {
    Sentry.init({
      dsn: CONFIG.sentry.dsn,
      integrations: [
        new BrowserTracing({
          tracingOrigins: CONFIG.sentry.tracingOrigins,
          routingInstrumentation: Sentry.routingInstrumentation,
        }),
      ],
      tracesSampleRate: 1.0,
    });
  }
}
