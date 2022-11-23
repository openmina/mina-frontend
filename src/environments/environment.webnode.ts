import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  backend: 'https://webrtc.minasync.com',
  minaExplorer: 'https://devnet.api.minaexplorer.com',
  features: ['web-node'],
  sentry: {
    dsn: 'https://57619b6a7a1248bea1c65abdb2104a03@o4504056952127488.ingest.sentry.io/4504057101549568',
    tracingOrigins: ['https://openmina-webnode.web.app'],
  },
  nodes: [
    {
      backend: 'https://webrtc.minasync.com',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      features: ['web-node'],
      name: 'webrtc',
    },
  ],
};
