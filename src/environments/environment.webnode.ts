import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  // sentry: {
  //   dsn: 'https://57619b6a7a1248bea1c65abdb2104a03@o4504056952127488.ingest.sentry.io/4504057101549568',
  //   tracingOrigins: ['https://openmina-webnode.web.app'],
  // },
  identifier: 'webrtc2',
  // aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  // nodeLister: {
  //   domain: 'http://65.21.195.80',
  //   port: 4000,
  // },
  isVanilla: true,
  globalConfig: {
    features: {
      // dashboard: ['nodes', 'topology'],
      // explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      // resources: ['system'],
      // network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      // tracing: ['overview', 'blocks'],
      // benchmarks: ['wallets', 'transactions'],
      // storage: ['accounts'],
      'snark-worker': ['dashboard', 'bootstrap', 'actions'],
      // 'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
    {
      'graphql': 'http://1.k8.openmina.com:31308/node1',
      'tracing-graphql': 'http://1.k8.openmina.com:31308/node1/internal-trace',
      'debugger': 'http://1.k8.openmina.com:31308/node1/bpf-debugger',
      'name': 'Hardcoded Webrtc2 Node',
    },
  ],
};

