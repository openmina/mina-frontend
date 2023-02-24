import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { CONFIG } from '@shared/constants/config';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { Event } from '@sentry/angular';

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
        new Sentry.Replay(),
      ],
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 0.1,
      tracesSampleRate: 1.0,
      beforeSend: (event: Event) => {
        event.fingerprint = [(Math.random() * 10000000).toString()];
        return event;
      }
    });
  }
}

// This is for openmina.com
//  dsn: "https://b3f84009064b4f0fa4aaed51437e1b8e@o4504536952733696.ingest.sentry.io/4504537179684864"
