import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  backend: 'https://debug.dev.tezedge.com:3086',
  debugger: 'https://debug.dev.tezedge.com',
  minaExplorer: 'https://devnet.api.minaexplorer.com',
  features: ['network'],
  sentry: {
    dsn: 'https://af49f4df760f48458792da44738e6634@o4504056952127488.ingest.sentry.io/4504100418617344',
    tracingOrigins: ['https://openmina-network-v2.web.app'],
  },
};
