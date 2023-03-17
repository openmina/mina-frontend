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
    features?: FeatureType[];
    subFeatures?: SubFeaturesConfig;
  }
}

export interface MinaNode {
  name: string;
  backend: string;
  debugger?: string;
  minaExplorer?: string;
  features?: FeatureType[];
  subFeatures?: SubFeaturesConfig;
}

export type FeatureType =
  | 'dashboard'
  | 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  | 'benchmarks'
  | 'explorer'
  | 'logs'
  ;

export type SubFeaturesConfig = {
  [key in FeatureType]?: string[];
};

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}
