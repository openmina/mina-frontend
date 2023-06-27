import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'openmina',
  aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  nodeLister: {
    domain: 'http://65.21.195.80',
    port: 4000,
  },
  isVanilla: true,
  globalConfig: {
    features: {
      dashboard: ['nodes'],
      // explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      // resources: ['system'],
      // network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      // benchmarks: ['wallets', 'transactions'],
      // storage: ['accounts'],
      // 'snark-worker': ['dashboard', 'actions'],
      // 'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
  //   {
  //     "graphql": "http://1.k8.openmina.com:31308/node1",
  //     "tracing-graphql": "http://1.k8.openmina.com:31308/node1/internal-trace",
  //     "debugger": "http://1.k8.openmina.com:31308/node1/bpf-debugger",
  //     "name": "node1"
  //   },
  //   {
  //     "graphql": "http://1.k8.openmina.com:31308/node2",
  //     "tracing-graphql": "http://1.k8.openmina.com:31308/node2/internal-trace",
  //     "debugger": "http://1.k8.openmina.com:31308/node2/bpf-debugger",
  //     "name": "node2"
  //   },
  //   {
  //     "graphql": "http://1.k8.openmina.com:31308/node3",
  //     "tracing-graphql": "http://1.k8.openmina.com:31308/node3/internal-trace",
  //     "debugger": "http://1.k8.openmina.com:31308/node3/bpf-debugger",
  //     "name": "node3"
  //   },
  //   {
  //     "graphql": "http://1.k8.openmina.com:31308/prod01",
  //     "tracing-graphql": "http://1.k8.openmina.com:31308/prod01/internal-trace",
  //     "debugger": "http://1.k8.openmina.com:31308/prod01/bpf-debugger",
  //     "name": "prod01"
  //   },
  //   {
  //     "graphql": "http://1.k8.openmina.com:31308/prod02",
  //     "tracing-graphql": "http://1.k8.openmina.com:31308/prod02/internal-trace",
  //     "debugger": "http://1.k8.openmina.com:31308/prod02/bpf-debugger",
  //     "name": "prod02"
  //   },
  ],
};

