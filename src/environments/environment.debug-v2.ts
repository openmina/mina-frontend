import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  sentry: {
    dsn: 'https://af49f4df760f48458792da44738e6634@o4504056952127488.ingest.sentry.io/4504100418617344',
    tracingOrigins: ['https://openmina-network-v2.web.app'],
  },
  configs: [
    {
      backend: 'https://webrtc.webnode.openmina.com',
      features: [],
      name: 'Web Node Demo',
    },
  ],
};
