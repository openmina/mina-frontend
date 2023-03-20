import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false, /* OPTIONAL */
  identifier: 'local', /* OPTIONAL */
  aggregator: 'http://1.k8.openmina.com:31308/aggregator', /* OPTIONAL */
  isVanilla: false, /* OPTIONAL */
  globalConfig: {
    features: {
      dashboard: ['nodes'],
      explorer: ['blocks', 'transactions', 'snark-pool', 'scan-state', 'snark-traces'],
      resources: ['system'],
      network: ['messages', 'connections', 'blocks', 'blocks-ipc'],
      tracing: ['overview', 'blocks'],
      benchmarks: ['wallets'],
      logs: [],
      'web-node': ['wallet', 'peers', 'logs', 'state'],
    },
  },
  configs: [
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node1',
    //   debugger: 'http://1.k8.openmina.com:31308/node1/bpf-debugger',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
    //   name: 'node1',
    // },
    // {
    //   // backend: 'http://sandbox.dev.openmina.com:3085',
    //   backend: 'https://trace.dev.openmina.com:3086',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],
    //   name: 'trace',
    // },
    // {
    //   backend: 'https://webrtc2.webnode.openmina.com:4432',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['web-node', 'tracing', 'explorer', 'benchmarks'],
    //   name: 'webrtc',
    // },
    // {
    //   debugger: 'https://debug.dev.openmina.com',
    //   backend: 'https://debug.dev.openmina.com:3086',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],
    //   name: 'debug',
    // },
    {
      backend: 'http://1.k8.openmina.com:31308/node1',
      debugger: 'http://1.k8.openmina.com:31308/node1/bpf-debugger', /* OPTIONAL */
      minaExplorer: 'https://berkeley.api.minaexplorer.com', /* OPTIONAL */
      name: 'node1',
      features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],  },
    {
      backend: 'http://1.k8.openmina.com:31308/node2',
      debugger: 'http://1.k8.openmina.com:31308/node2/bpf-debugger',
      name: 'node2',
      features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],   },
    {
      backend: 'http://1.k8.openmina.com:31308/node3',
      debugger: 'http://1.k8.openmina.com:31308/node3/bpf-debugger',
      name: 'node3',
      features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],},
    {
      backend: 'http://1.k8.openmina.com:31308/node4',
      name: 'node4',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node5',
      name: 'node5',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node6',
      name: 'node6',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node7',
      name: 'node7',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node8',
      name: 'node8',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node9',
      name: 'node9',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node10',
      name: 'node10',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node11',
      name: 'node11',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node12',
      name: 'node12',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node13',
      name: 'node13',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node14',
      name: 'node14',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node15',
      name: 'node15',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node16',
      name: 'node16',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node17',
      name: 'node17',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node18',
      name: 'node18',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node19',
      name: 'node19',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node20',
      name: 'node20',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node21',
      name: 'node21',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node22',
      name: 'node22',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node23',
      name: 'node23',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node24',
      name: 'node24',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node25',
      name: 'node25',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node26',
      name: 'node26',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node27',
      name: 'node27',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node28',
      name: 'node28',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node29',
      name: 'node29',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node30',
      name: 'node30',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node31',
      name: 'node31',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node32',
      name: 'node32',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node33',
      name: 'node33',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node34',
      name: 'node34',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node35',
      name: 'node35',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node36',
      name: 'node36',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node37',
      name: 'node37',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node38',
      name: 'node38',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node39',
      name: 'node39',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node40',
      name: 'node40',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node41',
      name: 'node41',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node42',
      name: 'node42',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node43',
      name: 'node43',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node44',
      name: 'node44',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node45',
      name: 'node45',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node46',
      name: 'node46',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node47',
      name: 'node47',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node48',
      name: 'node48',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node49',
      name: 'node49',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node50',
      name: 'node50',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node51',
      name: 'node51',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node52',
      name: 'node52',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node53',
      name: 'node53',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node54',
      name: 'node54',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node55',
      name: 'node55',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node56',
      name: 'node56',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node57',
      name: 'node57',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node58',
      name: 'node58',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node59',
      name: 'node59',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node60',
      name: 'node60',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node61',
      name: 'node61',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node62',
      name: 'node62',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node63',
      name: 'node63',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node64',
      name: 'node64',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node65',
      name: 'node65',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node66',
      name: 'node66',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node67',
      name: 'node67',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node68',
      name: 'node68',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node69',
      name: 'node69',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node70',
      name: 'node70',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node71',
      name: 'node71',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node72',
      name: 'node72',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node73',
      name: 'node73',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node74',
      name: 'node74',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node75',
      name: 'node75',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node76',
      name: 'node76',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node77',
      name: 'node77',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node78',
      name: 'node78',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node79',
      name: 'node79',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node80',
      name: 'node80',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node81',
      name: 'node81',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node82',
      name: 'node82',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node83',
      name: 'node83',
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node84',
    //   name: 'node84',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node85',
    //   name: 'node85',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node86',
    //   name: 'node86',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node87',
    //   name: 'node87',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node88',
    //   name: 'node88',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node89',
    //   name: 'node89',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node90',
    //   name: 'node90',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node91',
    //   name: 'node91',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node92',
    //   name: 'node92',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node93',
    //   name: 'node93',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node94',
    //   name: 'node94',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node95',
    //   name: 'node95',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node96',
    //   name: 'node96',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node97',
    //   name: 'node97',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node98',
    //   name: 'node98',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node99',
    //   name: 'node99',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node100',
    //   name: 'node100',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node101',
    //   name: 'node101',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node102',
    //   name: 'node102',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node103',
    //   name: 'node103',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node104',
    //   name: 'node104',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node105',
    //   name: 'node105',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node106',
    //   name: 'node106',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node107',
    //   name: 'node107',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node108',
    //   name: 'node108',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node109',
    //   name: 'node109',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node110',
    //   name: 'node110',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node111',
    //   name: 'node111',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node112',
    //   name: 'node112',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node113',
    //   name: 'node113',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node114',
    //   name: 'node114',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node115',
    //   name: 'node115',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node116',
    //   name: 'node116',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node117',
    //   name: 'node117',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node118',
    //   name: 'node118',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node119',
    //   name: 'node119',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node120',
    //   name: 'node120',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node121',
    //   name: 'node121',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node122',
    //   name: 'node122',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node123',
    //   name: 'node123',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node124',
    //   name: 'node124',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node125',
    //   name: 'node125',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node126',
    //   name: 'node126',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node127',
    //   name: 'node127',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node128',
    //   name: 'node128',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node129',
    //   name: 'node129',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node130',
    //   name: 'node130',
    // },
    {
      backend: 'http://1.k8.openmina.com:31308/prod1',
      name: 'prod1',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/prod2',
      name: 'prod2',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/prod3',
      name: 'prod3',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/prod4',
      name: 'prod4',
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod5',
    //   name: 'prod5',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod6',
    //   name: 'prod6',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod7',
    //   name: 'prod7',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod8',
    //   name: 'prod8',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod9',
    //   name: 'prod9',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod10',
    //   name: 'prod10',
    // },
    {
      backend: 'http://1.k8.openmina.com:31308/snarker1',
      name: 'snarker1',
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker2',
    //   name: 'snarker2',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker3',
    //   name: 'snarker3',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker4',
    //   name: 'snarker4',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker5',
    //   name: 'snarker5',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker6',
    //   name: 'snarker6',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker7',
    //   name: 'snarker7',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker8',
    //   name: 'snarker8',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker9',
    //   name: 'snarker9',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker10',
    //   name: 'snarker10',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed1',
    //   name: 'seed1',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed2',
    //   name: 'seed2',
    // },
    {
      backend: 'http://1.k8.openmina.com:31308/seed3',
      name: 'seed3',
    },
    {
      backend: 'http://1.k8.openmina.com:31308/seed4',
      name: 'seed4',
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed5',
    //   name: 'seed5',
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/transaction-generator',
    //   name: 'transaction-generator',
    // },
  ],
};

