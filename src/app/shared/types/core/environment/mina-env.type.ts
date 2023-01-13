export interface MinaEnv {
  production: boolean;
  configs: MinaNode[];
  aggregator?: string;
  sentry?: SentryConfig;
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
  ;

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}
