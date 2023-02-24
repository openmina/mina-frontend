import { SystemResourcesPoint } from '@shared/types/resources/system/system-resources-point.type';

export interface SystemResourcesChartData {
  cpu: SystemResourcesPoint[];
  cpuMax: number;
  memory: SystemResourcesPoint[];
  memoryMax: number;
  io: SystemResourcesPoint[];
  ioMax: number;
  network: SystemResourcesPoint[];
  networkMax: number;
  cpuTitle: string;
  cpuUm: string;
  memoryTitle: string;
  memoryUm: string;
  ioTitle: string;
  ioUm: string;
  networkTitle: string;
  networkUm: string;
}
