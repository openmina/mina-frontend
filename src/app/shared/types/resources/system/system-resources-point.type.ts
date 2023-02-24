import { SystemResourcesSubPoint } from '@shared/types/resources/system/system-resources-sub-point.type';

export class SystemResourcesPoint {
  timestamp: number;
  pathPoints: {
    [pathName: string]: SystemResourcesSubPoint;
  };
}
