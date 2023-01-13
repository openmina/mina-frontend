import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  configs: [
    {
      backend: 'https://webrtc.webnode.openmina.com',
      features: ['web-node-demo'],
      name: 'Web Node Demo',
    },
  ],
};
