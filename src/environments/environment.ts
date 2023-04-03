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
    },
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
      graphql: 'http://1.k8.openmina.com:31355/node1',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node1/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node1/bpf-debugger',
      minaExplorer: 'https://berkeley.api.minaexplorer.com',
      name: 'node1',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node2',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node2/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node2/bpf-debugger',
      name: 'node2',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node3',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node3/internal-trace',
      debugger: 'http://1.k8.openmina.com:31355/node3/bpf-debugger',
      name: 'node3',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node4',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node4/internal-trace',
      name: 'node4',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node5',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node5/internal-trace',
      name: 'node5',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node6',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node6/internal-trace',
      name: 'node6',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node7',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node7/internal-trace',
      name: 'node7',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/node8',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/node8/internal-trace',
      name: 'node8',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker008',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker008/internal-trace',
      name: 'snarker008',
    },
    {
      graphql: 'http://1.k8.openmina.com:31355/snarker023',
      'tracing-graphql': 'http://1.k8.openmina.com:31355/snarker023/internal-trace',
      name: 'snarker023',
    },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node9',
    //   name: 'node9',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node10',
    //   name: 'node10',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node11',
    //   name: 'node11',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node12',
    //   name: 'node12',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node13',
    //   name: 'node13',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node14',
    //   name: 'node14',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node15',
    //   name: 'node15',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node16',
    //   name: 'node16',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node17',
    //   name: 'node17',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node18',
    //   name: 'node18',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node19',
    //   name: 'node19',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node20',
    //   name: 'node20',
    // },
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
    //   graphql: 'http://1.k8.openmina.com:31355/node51',
    //   name: 'node51',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node52',
    //   name: 'node52',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node53',
    //   name: 'node53',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node54',
    //   name: 'node54',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node55',
    //   name: 'node55',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node56',
    //   name: 'node56',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node57',
    //   name: 'node57',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node58',
    //   name: 'node58',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node59',
    //   name: 'node59',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node60',
    //   name: 'node60',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node61',
    //   name: 'node61',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node62',
    //   name: 'node62',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node63',
    //   name: 'node63',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node64',
    //   name: 'node64',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node65',
    //   name: 'node65',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node66',
    //   name: 'node66',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node67',
    //   name: 'node67',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node68',
    //   name: 'node68',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node69',
    //   name: 'node69',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node70',
    //   name: 'node70',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node71',
    //   name: 'node71',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node72',
    //   name: 'node72',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node73',
    //   name: 'node73',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node74',
    //   name: 'node74',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node75',
    //   name: 'node75',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node76',
    //   name: 'node76',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node77',
    //   name: 'node77',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node78',
    //   name: 'node78',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node79',
    //   name: 'node79',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node80',
    //   name: 'node80',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node81',
    //   name: 'node81',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node82',
    //   name: 'node82',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node83',
    //   name: 'node83',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node84',
    //   name: 'node84',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node85',
    //   name: 'node85',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node86',
    //   name: 'node86',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node87',
    //   name: 'node87',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node88',
    //   name: 'node88',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node89',
    //   name: 'node89',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node90',
    //   name: 'node90',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node91',
    //   name: 'node91',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node92',
    //   name: 'node92',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node93',
    //   name: 'node93',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node94',
    //   name: 'node94',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node95',
    //   name: 'node95',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node96',
    //   name: 'node96',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node97',
    //   name: 'node97',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node98',
    //   name: 'node98',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node99',
    //   name: 'node99',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node100',
    //   name: 'node100',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node101',
    //   name: 'node101',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node102',
    //   name: 'node102',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node103',
    //   name: 'node103',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node104',
    //   name: 'node104',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node105',
    //   name: 'node105',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node106',
    //   name: 'node106',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node107',
    //   name: 'node107',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node108',
    //   name: 'node108',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node109',
    //   name: 'node109',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node110',
    //   name: 'node110',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node111',
    //   name: 'node111',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node112',
    //   name: 'node112',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node113',
    //   name: 'node113',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node114',
    //   name: 'node114',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node115',
    //   name: 'node115',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node116',
    //   name: 'node116',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node117',
    //   name: 'node117',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node118',
    //   name: 'node118',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node119',
    //   name: 'node119',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node120',
    //   name: 'node120',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node121',
    //   name: 'node121',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node122',
    //   name: 'node122',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node123',
    //   name: 'node123',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node124',
    //   name: 'node124',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node125',
    //   name: 'node125',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node126',
    //   name: 'node126',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node127',
    //   name: 'node127',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node128',
    //   name: 'node128',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node129',
    //   name: 'node129',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/node130',
    //   name: 'node130',
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
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod4',
    //   name: 'prod4',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod5',
    //   name: 'prod5',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod6',
    //   name: 'prod6',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod7',
    //   name: 'prod7',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod8',
    //   name: 'prod8',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod9',
    //   name: 'prod9',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/prod10',
    //   name: 'prod10',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker1',
    //   name: 'snarker1',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker2',
    //   name: 'snarker2',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker3',
    //   name: 'snarker3',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker4',
    //   name: 'snarker4',
    // },
    // {
    //   graphql: 'http://1.k8.openmina.com:31355/snarker5',
    //   name: 'snarker5',
    // },
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

