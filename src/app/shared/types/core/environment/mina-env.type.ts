export interface MinaEnv {
  production: boolean;
  backend: string;
  debugger?: string;
  minaExplorer: string;
  features: FeatureType[];
  sentry?: SentryConfig;
  nodes: MinaNode[];
}

export type FeatureType = 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  | 'stressing'
  ;

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}

export interface MinaNode {
  backend: string;
  debugger?: string;
  minaExplorer: string;
  features: FeatureType[];
  name: string;
}
