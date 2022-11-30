import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  // debugger: 'http://develop.dev.openmina.com',
  debugger: 'https://debug.dev.openmina.com',
  backend: 'https://debug.dev.openmina.com:3086',
  // backend: 'https://webrtc.webnode.openmina.com',
  // backend: 'https://trace.dev.openmina.com:3086',
  minaExplorer: 'https://berkeley.api.minaexplorer.com',
  features: ['resources', 'network', 'tracing', 'web-node', 'stressing'],
  nodes: [
    {
      debugger: 'https://debug.dev.openmina.com',
      // backend: 'https://debug.dev.openmina.com:3086',
      // backend: 'https://webrtc.webnode.openmina.com',
      backend: 'https://trace.dev.openmina.com:3086',
      minaExplorer: 'https://berkeley.minaexplorer.com',
      features: ['resources', 'network', 'tracing', 'web-node', 'stressing'],
      name: 'trace',
    },
    {
      debugger: 'https://debug.dev.openmina.com',
      // backend: 'https://debug.dev.openmina.com:3086',
      backend: 'https://webrtc.webnode.openmina.com',
      // backend: 'https://trace.dev.openmina.com:3086',
      minaExplorer: 'https://berkeley.minaexplorer.com',
      features: ['resources', 'network', 'tracing', 'web-node', 'stressing'],
      name: 'web-node',
    },
  ]
};
