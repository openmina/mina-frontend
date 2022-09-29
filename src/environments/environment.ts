import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: false,
  // backend: 'https://trace.dev.tezedge.com:3086',
  backend: 'https://debug.dev.tezedge.com:3086',
  // backend: 'https://mina-mainnet-graphql.aurowallet.com',
  debugger: 'https://debug.dev.tezedge.com',
};
