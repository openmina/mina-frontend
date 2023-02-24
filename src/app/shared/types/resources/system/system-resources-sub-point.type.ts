export interface SystemResourcesSubPoint {
  value: number;
  taskThreads: SystemResourcesPointThread[] | null;
}

export interface SystemResourcesPointThread {
  name: string;
  value: number;
}
