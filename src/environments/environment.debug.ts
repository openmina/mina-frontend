import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  sentry: {
    dsn: 'https://c664d3516f94438d87f6f5813cf438e8@o4504056952127488.ingest.sentry.io/4504056966676480',
    tracingOrigins: ['https://openmina-network.web.app'],
  },
  configs: [
    {
      "graphql": "http://1.k8.openmina.com:31308/node1",
      "tracing-graphql": "http://1.k8.openmina.com:31308/node1/internal-trace",
      "debugger": "http://1.k8.openmina.com:31308/node1/bpf-debugger",
      "name": "node1"
    }
  ],
  identifier: 'webrtc2',
  globalConfig: {
    features: {
      'snark-worker': ['actions'],
    },
  },
};
