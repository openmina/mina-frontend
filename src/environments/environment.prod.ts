import { MinaEnv } from '@shared/types/core/environment/mina-env.type';

export const environment: Readonly<MinaEnv> = {
  production: true,
  identifier: window['env']['identifier'],
  aggregator: window['env']['aggregator'] || '',
  configs: window['env']['configs'] || [],
  globalConfig: window['env']['globalConfig'] || undefined,
  isVanilla: window['env']['isVanilla'],
  nodeLister: window['env']['nodeLister'],
};
