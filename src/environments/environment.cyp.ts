import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  aggregator: '/agg',
  configs: [{
    backend: 'http://1.k8.openmina.com:31311/node1',
    debugger: 'http://1.k8.openmina.com:31311/node1/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'node1',
  }, {
    backend: 'http://1.k8.openmina.com:31311/node2',
    debugger: 'http://1.k8.openmina.com:31311/node2/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'node2',
  }, {
    backend: 'http://1.k8.openmina.com:31311/node3',
    debugger: 'http://1.k8.openmina.com:31311/node3/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'node3',
  }, {
    backend: 'http://1.k8.openmina.com:31311/node4',
    debugger: 'http://1.k8.openmina.com:31311/node4/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'node4',
  }, {
    backend: 'http://1.k8.openmina.com:31311/node5',
    debugger: 'http://1.k8.openmina.com:31311/node5/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'node5',
  }, {
    backend: 'http://1.k8.openmina.com:31311/snarker9',
    debugger: 'http://1.k8.openmina.com:31311/snarker9/bpf-debugger',
    features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs'],
    name: 'snarker9',
  }],
};
