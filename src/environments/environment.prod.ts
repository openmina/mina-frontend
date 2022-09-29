import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  backend: 'https://debug.dev.tezedge.com:3086',
  // backend: 'https://trace.dev.tezedge.com:3086',
  debugger: 'https://debug.dev.tezedge.com',
};
