import { FeaturesConfig, FeatureType, MinaEnv, MinaNode } from '@shared/types/core/environment/mina-env.type';
import { environment } from '@environment/environment';
import { hasValue } from '@shared/helpers/values.helper';

export const CONFIG: Readonly<MinaEnv> = {
  ...environment,
  aggregator: getURL(environment.aggregator),
  configs: environment.configs.map((node: MinaNode) => ({
    ...node,
    debugger: getURL(node.debugger),
    backend: getURL(node.backend),
  })),
};

export function getURL(pathOrUrl: string): string {
  if (pathOrUrl) {
    let href = new URL(pathOrUrl, origin).href;
    if (href.endsWith('/')) {
      href = href.slice(0, -1);
    }
    return href;
  }
  return pathOrUrl;
}

export function isVanilla(): boolean {
  return CONFIG.isVanilla;
}

export function isNotVanilla(): boolean {
  return !CONFIG.isVanilla;
}

export function getAvailableFeatures(config: MinaNode): FeatureType[] {
  return Object.keys(getFeaturesConfig(config)) as FeatureType[];
}

export function getFirstFeature(config: MinaNode = CONFIG.configs[0]): FeatureType {
  return Object.keys(getFeaturesConfig(config))[0] as FeatureType;
}

export function isFeatureEnabled(config: MinaNode, feature: FeatureType): boolean {
  return hasValue(getFeaturesConfig(config)[feature]);
}

export function getFeaturesConfig(config: MinaNode): FeaturesConfig {
  return config.features || CONFIG.globalConfig?.features;
}
