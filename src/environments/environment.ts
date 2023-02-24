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
      backend: 'http://1.k8.openmina.com:31311/node1',
      debugger: 'http://1.k8.openmina.com:31311/node1/bpf-debugger',
      name: 'node1',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node2',
      name: 'node2',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node3',
      name: 'node3',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node4',
    //   name: 'node4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node5',
    //   name: 'node5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node6',
    //   name: 'node6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node7',
    //   name: 'node7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node8',
    //   name: 'node8',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node9',
    //   name: 'node9',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node10',
    //   name: 'node10',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node11',
    //   name: 'node11',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node12',
    //   name: 'node12',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node13',
    //   name: 'node13',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node14',
    //   name: 'node14',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node15',
    //   name: 'node15',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node16',
    //   name: 'node16',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node17',
    //   name: 'node17',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node18',
    //   name: 'node18',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node19',
    //   name: 'node19',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node20',
    //   name: 'node20',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node21',
    //   name: 'node21',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node22',
    //   name: 'node22',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node23',
    //   name: 'node23',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node24',
    //   name: 'node24',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node25',
    //   name: 'node25',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node26',
    //   name: 'node26',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node27',
    //   name: 'node27',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node28',
    //   name: 'node28',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node29',
    //   name: 'node29',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node30',
    //   name: 'node30',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node31',
    //   name: 'node31',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node32',
    //   name: 'node32',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node33',
    //   name: 'node33',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node34',
    //   name: 'node34',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node35',
    //   name: 'node35',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node36',
    //   name: 'node36',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node37',
    //   name: 'node37',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node38',
    //   name: 'node38',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node39',
    //   name: 'node39',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node40',
    //   name: 'node40',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node41',
    //   name: 'node41',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node42',
    //   name: 'node42',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node43',
    //   name: 'node43',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node44',
    //   name: 'node44',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node45',
    //   name: 'node45',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node46',
    //   name: 'node46',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node47',
    //   name: 'node47',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node48',
    //   name: 'node48',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node49',
    //   name: 'node49',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node50',
    //   name: 'node50',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node51',
    //   name: 'node51',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node52',
    //   name: 'node52',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node53',
    //   name: 'node53',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node54',
    //   name: 'node54',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node55',
    //   name: 'node55',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node56',
    //   name: 'node56',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node57',
    //   name: 'node57',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node58',
    //   name: 'node58',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node59',
    //   name: 'node59',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node60',
    //   name: 'node60',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node61',
    //   name: 'node61',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node62',
    //   name: 'node62',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node63',
    //   name: 'node63',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node64',
    //   name: 'node64',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node65',
    //   name: 'node65',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node66',
    //   name: 'node66',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node67',
    //   name: 'node67',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node68',
    //   name: 'node68',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node69',
    //   name: 'node69',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node70',
    //   name: 'node70',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node71',
    //   name: 'node71',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node72',
    //   name: 'node72',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node73',
    //   name: 'node73',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node74',
    //   name: 'node74',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node75',
    //   name: 'node75',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node76',
    //   name: 'node76',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node77',
    //   name: 'node77',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node78',
    //   name: 'node78',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node79',
    //   name: 'node79',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node80',
    //   name: 'node80',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node81',
    //   name: 'node81',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node82',
    //   name: 'node82',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node83',
    //   name: 'node83',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node84',
    //   name: 'node84',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node85',
    //   name: 'node85',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node86',
    //   name: 'node86',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node87',
    //   name: 'node87',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node88',
    //   name: 'node88',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node89',
    //   name: 'node89',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node90',
    //   name: 'node90',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node91',
    //   name: 'node91',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node92',
    //   name: 'node92',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node93',
    //   name: 'node93',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node94',
    //   name: 'node94',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node95',
    //   name: 'node95',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node96',
    //   name: 'node96',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node97',
    //   name: 'node97',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node98',
    //   name: 'node98',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node99',
    //   name: 'node99',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node100',
    //   name: 'node100',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node101',
    //   name: 'node101',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node102',
    //   name: 'node102',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node103',
    //   name: 'node103',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node104',
    //   name: 'node104',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node105',
    //   name: 'node105',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node106',
    //   name: 'node106',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node107',
    //   name: 'node107',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node108',
    //   name: 'node108',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node109',
    //   name: 'node109',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node110',
    //   name: 'node110',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node111',
    //   name: 'node111',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node112',
    //   name: 'node112',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node113',
    //   name: 'node113',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node114',
    //   name: 'node114',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node115',
    //   name: 'node115',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node116',
    //   name: 'node116',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node117',
    //   name: 'node117',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node118',
    //   name: 'node118',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node119',
    //   name: 'node119',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node120',
    //   name: 'node120',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node121',
    //   name: 'node121',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node122',
    //   name: 'node122',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node123',
    //   name: 'node123',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node124',
    //   name: 'node124',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node125',
    //   name: 'node125',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node126',
    //   name: 'node126',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node127',
    //   name: 'node127',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node128',
    //   name: 'node128',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node129',
    //   name: 'node129',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/node130',
    //   name: 'node130',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod1',
    //   name: 'prod1',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod2',
    //   name: 'prod2',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod3',
    //   name: 'prod3',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod4',
    //   name: 'prod4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod5',
    //   name: 'prod5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod6',
    //   name: 'prod6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod7',
    //   name: 'prod7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod8',
    //   name: 'prod8',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod9',
    //   name: 'prod9',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/prod10',
    //   name: 'prod10',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker1',
    //   name: 'snarker1',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker2',
    //   name: 'snarker2',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker3',
    //   name: 'snarker3',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker4',
    //   name: 'snarker4',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker5',
    //   name: 'snarker5',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker6',
    //   name: 'snarker6',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    // {
    //   backend: 'http://1.k8.openmina.com:31311/snarker7',
    //   name: 'snarker7',
    //   features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    // },
    {
      backend: 'http://1.k8.openmina.com:31311/snarker8',
      name: 'snarker8',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/snarker9',
      name: 'snarker9',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/snarker10',
      name: 'snarker10',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed1',
      name: 'seed1',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed2',
      name: 'seed2',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed3',
      name: 'seed3',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed4',
      name: 'seed4',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed5',
      name: 'seed5',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/transaction-generator',
      name: 'transaction-generator',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources'],
    },
  ],
};

