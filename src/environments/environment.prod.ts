import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  // backend: 'https://debug.dev.tezedge.com:3086',
  backend: 'https://webrtc.minasync.com',
  // backend: 'https://trace.dev.tezedge.com:3086',
  // debugger: 'http://develop.dev.tezedge.com',
  debugger: 'http://develop.dev.tezedge.com:80',
  minaExplorer: 'https://devnet.api.minaexplorer.com',
  features: ['resources', 'network', 'tracing', 'web-node'],
  sentry: {
    dsn: '',
    tracingOrigins: [],
  },
};
