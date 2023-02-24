import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  sentry: {
    dsn: 'https://381267cdcedb460697e215609b93433c@o4504536952733696.ingest.sentry.io/4504537157074944',
    tracingOrigins: ['https://openmina-webnodedemo.web.app'],
  },
  configs: [
    {
      backend: 'https://webrtc.webnode.openmina.com',
      features: ['web-node-demo'],
      name: 'Web Node Demo',
    },
  ],
};
