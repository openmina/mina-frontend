import { SystemResourcesPoint } from '@shared/types/resources/system/system-resources-point.type';

export interface SystemResourcesActivePoint {
  point: SystemResourcesPoint;
  title: string;
  colors: string[];
  um: string;
}
