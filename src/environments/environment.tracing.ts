import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  sentry: {
    dsn: 'https://8c7f862e900a46a4ac1c3555a4fc609f@o4504056952127488.ingest.sentry.io/4504057049382912',
    tracingOrigins: ['https://openmina-tracing.web.app'],
  },
  configs: [
    {
      graphql: 'https://trace.dev.openmina.com:3086',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      features: {
        tracing: ['overview', 'blocks'],
        explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      },
      name: 'initial-trace',
    },
    {
      graphql: 'https://sandbox.dev.openmina.com:3086',
      minaExplorer: 'https://devnet.api.minaexplorer.com',
      features: {
        tracing: ['overview', 'blocks'],
        explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      },
      name: 'lower-latency',
    },
  ],
};
