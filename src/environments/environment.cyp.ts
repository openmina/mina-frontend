import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  aggregator: '/agg',
  configs: [
    {
      backend: 'http://1.k8.openmina.com:31311/node1',
      debugger: 'http://1.k8.openmina.com:31311/node1/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'node1',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node2',
      debugger: 'http://1.k8.openmina.com:31311/node2/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'node2',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node3',
      debugger: 'http://1.k8.openmina.com:31311/node3/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'node3',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node4',
      debugger: 'http://1.k8.openmina.com:31311/node4/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'node4',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/node5',
      debugger: 'http://1.k8.openmina.com:31311/node5/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'node5',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/snarker9',
      debugger: 'http://1.k8.openmina.com:31311/snarker9/bpf-debugger',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
      name: 'snarker9',
    },
    {
      backend: 'http://1.k8.openmina.com:31311/prod1',
      name: 'prod1',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'web-node'],
    },
    {
      backend: 'http://1.k8.openmina.com:31311/seed1',
      name: 'seed1',
      features: ['dashboard', 'network', 'benchmarks', 'explorer', 'tracing', 'resources', 'logs', 'web-node'],
    },
  ],
};
