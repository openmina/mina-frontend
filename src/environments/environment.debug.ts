import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  backend: 'https://debug.dev.tezedge.com:3086',
  debugger: 'https://debug.dev.tezedge.com',
  minaExplorer: 'https://devnet.api.minaexplorer.com',
  features: ['network'],
  sentry: {
    dsn: 'https://c664d3516f94438d87f6f5813cf438e8@o4504056952127488.ingest.sentry.io/4504056966676480',
    tracingOrigins: ['https://openmina-network.web.app'],
  },
};
