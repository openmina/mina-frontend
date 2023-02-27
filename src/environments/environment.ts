import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  identifier: 'local',
  aggregator: 'http://1.k8.openmina.com:31308/aggregator',
  isVanilla: false,
  configs: [
    // {
    //   // backend: 'http://sandbox.dev.openmina.com:3085',
    //   backend: 'https://trace.dev.openmina.com:3086',
    //   minaExplorer: 'https://berkeley.api.minaexplorer.com',
    //   features: ['dashboard', 'resources', 'network', 'tracing', 'web-node', 'benchmarks', 'explorer'],
    //   name: 'trace',
    // },
    // {
    //   backend: 'https://webrtc.webnode.openmina.com',
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
      debugger: 'http://1.k8.openmina.com:31308/node1/bpf-debugger',
      name: 'node1',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node2',
      name: 'node2',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31308/node3',
      name: 'node3',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node4',
    //   name: 'node4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node5',
    //   name: 'node5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node6',
    //   name: 'node6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node7',
    //   name: 'node7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node8',
    //   name: 'node8',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node9',
    //   name: 'node9',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node10',
    //   name: 'node10',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node11',
    //   name: 'node11',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node12',
    //   name: 'node12',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node13',
    //   name: 'node13',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node14',
    //   name: 'node14',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node15',
    //   name: 'node15',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node16',
    //   name: 'node16',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node17',
    //   name: 'node17',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node18',
    //   name: 'node18',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node19',
    //   name: 'node19',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node20',
    //   name: 'node20',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node21',
    //   name: 'node21',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node22',
    //   name: 'node22',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node23',
    //   name: 'node23',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node24',
    //   name: 'node24',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node25',
    //   name: 'node25',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node26',
    //   name: 'node26',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node27',
    //   name: 'node27',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node28',
    //   name: 'node28',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node29',
    //   name: 'node29',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node30',
    //   name: 'node30',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node31',
    //   name: 'node31',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node32',
    //   name: 'node32',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node33',
    //   name: 'node33',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node34',
    //   name: 'node34',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node35',
    //   name: 'node35',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node36',
    //   name: 'node36',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node37',
    //   name: 'node37',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node38',
    //   name: 'node38',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node39',
    //   name: 'node39',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node40',
    //   name: 'node40',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node41',
    //   name: 'node41',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node42',
    //   name: 'node42',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node43',
    //   name: 'node43',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node44',
    //   name: 'node44',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node45',
    //   name: 'node45',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node46',
    //   name: 'node46',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node47',
    //   name: 'node47',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node48',
    //   name: 'node48',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node49',
    //   name: 'node49',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node50',
    //   name: 'node50',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node51',
    //   name: 'node51',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node52',
    //   name: 'node52',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node53',
    //   name: 'node53',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node54',
    //   name: 'node54',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node55',
    //   name: 'node55',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node56',
    //   name: 'node56',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node57',
    //   name: 'node57',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node58',
    //   name: 'node58',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node59',
    //   name: 'node59',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node60',
    //   name: 'node60',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node61',
    //   name: 'node61',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node62',
    //   name: 'node62',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node63',
    //   name: 'node63',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node64',
    //   name: 'node64',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node65',
    //   name: 'node65',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node66',
    //   name: 'node66',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node67',
    //   name: 'node67',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node68',
    //   name: 'node68',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node69',
    //   name: 'node69',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node70',
    //   name: 'node70',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node71',
    //   name: 'node71',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node72',
    //   name: 'node72',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node73',
    //   name: 'node73',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node74',
    //   name: 'node74',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node75',
    //   name: 'node75',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node76',
    //   name: 'node76',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node77',
    //   name: 'node77',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node78',
    //   name: 'node78',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node79',
    //   name: 'node79',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node80',
    //   name: 'node80',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node81',
    //   name: 'node81',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node82',
    //   name: 'node82',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node83',
    //   name: 'node83',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node84',
    //   name: 'node84',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node85',
    //   name: 'node85',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node86',
    //   name: 'node86',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node87',
    //   name: 'node87',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node88',
    //   name: 'node88',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node89',
    //   name: 'node89',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node90',
    //   name: 'node90',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node91',
    //   name: 'node91',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node92',
    //   name: 'node92',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node93',
    //   name: 'node93',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node94',
    //   name: 'node94',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node95',
    //   name: 'node95',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node96',
    //   name: 'node96',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node97',
    //   name: 'node97',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node98',
    //   name: 'node98',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node99',
    //   name: 'node99',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node100',
    //   name: 'node100',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node101',
    //   name: 'node101',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node102',
    //   name: 'node102',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node103',
    //   name: 'node103',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node104',
    //   name: 'node104',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node105',
    //   name: 'node105',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node106',
    //   name: 'node106',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node107',
    //   name: 'node107',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node108',
    //   name: 'node108',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node109',
    //   name: 'node109',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node110',
    //   name: 'node110',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node111',
    //   name: 'node111',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node112',
    //   name: 'node112',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node113',
    //   name: 'node113',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node114',
    //   name: 'node114',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node115',
    //   name: 'node115',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node116',
    //   name: 'node116',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node117',
    //   name: 'node117',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node118',
    //   name: 'node118',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node119',
    //   name: 'node119',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node120',
    //   name: 'node120',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node121',
    //   name: 'node121',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node122',
    //   name: 'node122',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node123',
    //   name: 'node123',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node124',
    //   name: 'node124',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node125',
    //   name: 'node125',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node126',
    //   name: 'node126',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node127',
    //   name: 'node127',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node128',
    //   name: 'node128',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node129',
    //   name: 'node129',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/node130',
    //   name: 'node130',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod1',
    //   name: 'prod1',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod2',
    //   name: 'prod2',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod3',
    //   name: 'prod3',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod4',
    //   name: 'prod4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod5',
    //   name: 'prod5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod6',
    //   name: 'prod6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod7',
    //   name: 'prod7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod8',
    //   name: 'prod8',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod9',
    //   name: 'prod9',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/prod10',
    //   name: 'prod10',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker1',
    //   name: 'snarker1',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker2',
    //   name: 'snarker2',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker3',
    //   name: 'snarker3',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker4',
    //   name: 'snarker4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker5',
    //   name: 'snarker5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker6',
    //   name: 'snarker6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker7',
    //   name: 'snarker7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker8',
    //   name: 'snarker8',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker9',
    //   name: 'snarker9',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/snarker10',
    //   name: 'snarker10',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed1',
    //   name: 'seed1',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed2',
    //   name: 'seed2',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed3',
    //   name: 'seed3',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed4',
    //   name: 'seed4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/seed5',
    //   name: 'seed5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31308/transaction-generator',
    //   name: 'transaction-generator',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
  ],
};

