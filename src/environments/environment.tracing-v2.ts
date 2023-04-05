import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: 'OpenMina Fuzzing',
  globalConfig: {
    features: {
      fuzzing: ['ocaml', 'rust'],
    },
    forceStart: true,
  },
  configs: [
  ],
};
