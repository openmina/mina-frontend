import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  identifier: 'local',
  aggregator: 'http://1.k8.openmina.com:31355/aggregator',
  isVanilla: false,
  globalConfig: {
    features: {
      dashboard: ['nodes'],
      explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      resources: ['system'],
      network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      benchmarks: ['wallets'],
      'web-node': ['wallet', 'peers', 'logs', 'state'],
      fuzzing: ['ocaml', 'rust'],
    },
    // forceStart: true,
  },

  configs: [
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node1',
    //   debugger: 'http://1.k8.openmina.com:31355/node1/bpf-debugger',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
    //   name: 'node1',
    // },
    // {
    //   // graphql: 'http://sandbox.dev.openmina.com:3085',
    //   graphql: 'https://trace.dev.openmina.com:3086',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],
    //   name: 'trace',
    // },
    // {
    //   graphql: 'https://webrtc2.webnode.openmina.com:4432',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['web-node', 'tracing', 'explorer', 'benchmarks'],
    //   name: 'webrtc',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31400/snark-coordinator',
    //   'tracing-graphql': 'http://1.k8.openmina.com:31400/snark-coordinator/internal-trace',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],
    //   name: 'snark-coordinator',
    // },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod2',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod2/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod2/bpf-debugger',
      name: 'prod2',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/seed1',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/seed1/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/seed1/bpf-debugger',
      name: 'seed1',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/seed2',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/seed2/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/seed2/bpf-debugger',
      name: 'seed2',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod3',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod3/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod3/bpf-debugger',
      name: 'prod3',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker084',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker084/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker084/bpf-debugger',
      name: 'snarker084',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker088',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker088/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker088/bpf-debugger',
      name: 'snarker088',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node4',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node4/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node4/bpf-debugger',
      name: 'node4',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node5',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node5/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node5/bpf-debugger',
      name: 'node5',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node6',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node6/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node6/bpf-debugger',
      name: 'node6',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node7',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node7/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node7/bpf-debugger',
      name: 'node7',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node8',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node8/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node8/bpf-debugger',
      name: 'node8',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker004',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker004/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker004/bpf-debugger',
      name: 'snarker004',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker023',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker023/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker023/bpf-debugger',
      name: 'snarker023',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node9',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node9/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node9/bpf-debugger',
      name: 'node9',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node10',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node10/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node10/bpf-debugger',
      name: 'node10',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node11',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node11/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node11/bpf-debugger',
      name: 'node11',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node12',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node12/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node12/bpf-debugger',
      name: 'node12',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node13',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node13/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node13/bpf-debugger',
      name: 'node13',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node14',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node14/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node14/bpf-debugger',
      name: 'node14',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node15',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node15/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node15/bpf-debugger',
      name: 'node15',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node16',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node16/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node16/bpf-debugger',
      name: 'node16',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node17',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node17/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node17/bpf-debugger',
      name: 'node17',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node18',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node18/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node18/bpf-debugger',
      name: 'node18',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node19',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node19/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node19/bpf-debugger',
      name: 'node19',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node20',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node20/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node20/bpf-debugger',
      name: 'node20',
    },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node21',
    //   name: 'node21',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node22',
    //   name: 'node22',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node23',
    //   name: 'node23',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node24',
    //   name: 'node24',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node25',
    //   name: 'node25',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node26',
    //   name: 'node26',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node27',
    //   name: 'node27',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node28',
    //   name: 'node28',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node29',
    //   name: 'node29',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node30',
    //   name: 'node30',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node31',
    //   name: 'node31',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node32',
    //   name: 'node32',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node33',
    //   name: 'node33',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node34',
    //   name: 'node34',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node35',
    //   name: 'node35',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node36',
    //   name: 'node36',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node37',
    //   name: 'node37',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node38',
    //   name: 'node38',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node39',
    //   name: 'node39',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node40',
    //   name: 'node40',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node41',
    //   name: 'node41',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node42',
    //   name: 'node42',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node43',
    //   name: 'node43',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node44',
    //   name: 'node44',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node45',
    //   name: 'node45',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node46',
    //   name: 'node46',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node47',
    //   name: 'node47',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node48',
    //   name: 'node48',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node49',
    //   name: 'node49',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node50',
    //   name: 'node50',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod1',
    //   name: 'prod1',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod2',
    //   name: 'prod2',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod3',
    //   name: 'prod3',
    // },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod4',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod4/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod4/bpf-debugger',
      name: 'prod4',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod5',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod5/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod5/bpf-debugger',
      name: 'prod5',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod6',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod6/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod6/bpf-debugger',
      name: 'prod6',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod7',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod7/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod7/bpf-debugger',
      name: 'prod7',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod8',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod8/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod8/bpf-debugger',
      name: 'prod8',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod9',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod9/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod9/bpf-debugger',
      name: 'prod9',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/prod10',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/prod10/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/prod10/bpf-debugger',
      name: 'prod10',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker010',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker010/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker010/bpf-debugger',
      name: 'snarker010',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker011',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker011/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker011/bpf-debugger',
      name: 'snarker011',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker012',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker012/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker012/bpf-debugger',
      name: 'snarker012',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker013',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker013/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker013/bpf-debugger',
      name: 'snarker013',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker014',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker014/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/snarker014/bpf-debugger',
      name: 'snarker014',
    },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker6',
    //   name: 'snarker6',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker7',
    //   name: 'snarker7',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker8',
    //   name: 'snarker8',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker9',
    //   name: 'snarker9',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker10',
    //   name: 'snarker10',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/seed1',
    //   name: 'seed1',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/seed2',
    //   name: 'seed2',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/seed3',
    //   name: 'seed3',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/seed4',
    //   name: 'seed4',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/seed5',
    //   name: 'seed5',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/transaction-generator',
    //   name: 'transaction-generator',
    // },
  ],
};

