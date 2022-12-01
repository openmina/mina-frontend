export interface MinaEnv {
  production: boolean;
  nodes: MinaNode[];
  sentry?: SentryConfig;
}

export interface MinaNode {
  backend: string;
  debugger?: string;
  minaExplorer: string;
  features: FeatureType[];
  name: string;
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
