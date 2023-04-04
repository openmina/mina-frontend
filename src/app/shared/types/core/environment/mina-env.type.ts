import { FirebaseOptions } from '@firebase/app';

export interface MinaEnv {
  production: boolean;
  configs: MinaNode[];
  identifier?: string;
  isVanilla?: boolean;
  aggregator?: string;
  sentry?: SentryConfig;
  firebase?: FirebaseOptions;
  globalConfig?: {
    features?: FeaturesConfig;
    forceStart?: boolean;
  }
}

export interface MinaNode {
  name: string;
  graphql: string;
  'tracing-graphql'?: string;
  debugger?: string;
  minaExplorer?: string;
  features?: FeaturesConfig | string[];
}

export type FeaturesConfig = {
  [key in FeatureType]?: string[];
};

export type FeatureType =
  | 'dashboard'
  | 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  | 'benchmarks'
  | 'explorer'
  | 'logs'
  | 'fuzzing'
  ;

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}
