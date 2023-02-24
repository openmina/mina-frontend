import { FirebaseOptions } from '@firebase/app';

export interface MinaEnv {
  production: boolean;
  configs: MinaNode[];
  identifier?: string;
  isVanilla?: boolean;
  aggregator?: string;
  sentry?: SentryConfig;
  firebase?: FirebaseOptions;
}

export interface MinaNode {
  backend: string;
  debugger?: string;
  minaExplorer?: string;
  features: FeatureType[];
  name: string;
}

export type FeatureType =
  | 'dashboard'
  | 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  | 'web-node-demo'
  | 'benchmarks'
  | 'explorer'
  | 'logs'
  ;

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}
