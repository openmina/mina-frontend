import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  // backend: 'https://debug.dev.openmina.com:3086',
  backend: 'https://webrtc.openmina.com',
  // backend: 'https://trace.dev.openmina.com:3086',
  // debugger: 'http://develop.dev.openmina.com',
  debugger: 'http://develop.dev.openmina.com:80',
  minaExplorer: 'https://devnet.api.minaexplorer.com',
  features: ['resources', 'network', 'tracing', 'web-node'],
  sentry: {
    dsn: '',
    tracingOrigins: [],
  },
  nodes: [],
};
