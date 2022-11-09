export interface MinaEnv {
  production: boolean;
  backend: string;
  debugger?: string;
  minaExplorer: string;
  features: FeatureType[];
  sentry?: SentryConfig;
}

export type FeatureType = 'resources'
  | 'network'
  | 'tracing'
  | 'web-node'
  ;

interface SentryConfig {
  dsn: string;
  tracingOrigins: string[];
}
