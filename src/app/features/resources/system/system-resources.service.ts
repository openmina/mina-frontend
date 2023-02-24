import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, map, Observable } from 'rxjs';
import { SystemResourcesChartData } from '@shared/types/resources/system/system-resources-chart-data.type';
import { ConfigService } from '@core/services/config.service';
import { LoadingService } from '@core/services/loading.service';
import { SystemResourcesPoint } from '@shared/types/resources/system/system-resources-point.type';
import { niceYScale } from '@shared/helpers/graph.helper';

const MB_DIVISOR = 1048576;
const GB_DIVISOR = 1073741824;

@Injectable({
  providedIn: 'root',
})
export class SystemResourcesService {

  constructor(private http: HttpClient,
              private config: ConfigService,
              private loadingService: LoadingService) { }

  getResources(): Observable<SystemResourcesChartData> {
    this.loadingService.addURL();
    return this.http.get<any>(this.config.API + '/resources?limit=1500').pipe(
      map(response => SystemResourcesService.mapSystemResourcesResponse(response)),
      finalize(() => this.loadingService.removeURL()),
    );
  }

  private static mapSystemResourcesResponse(response: any[]): SystemResourcesChartData {
    response = response.reverse();
    const resources = {
      cpu: [],
      memory: [],
      io: [],
      network: [],
      cpuMax: 0,
      memoryMax: 0,
      ioMax: 0,
      networkMax: 0,
    } as SystemResourcesChartData;
    const cpuNames = {};
    const memoryNames = {};
    const ioNames = {};
    const networkNames = {};
    const keys = (item: any, key: string): any[] => Object.keys(item[key].subprocesses.subprocesses);
    response.forEach(item => {
      keys(item, 'cpu').forEach(key => {
        if (!cpuNames[key]) {
          cpuNames[key] = {};
        }
      });
      keys(item, 'memory').forEach(key => {
        if (!memoryNames[key]) {
          memoryNames[key] = {};
        }
      });
      keys(item, 'io').forEach(key => {
        if (!ioNames[key]) {
          ioNames[key] = {};
        }
      });
      keys(item, 'network').forEach(key => {
        if (!networkNames[key]) {
          networkNames[key] = {};
        }
      });
    });
    response.forEach(item => {
      const timestamp = item.timestamp * 1000;
      resources.cpu.push({
        timestamp,
        pathPoints: Object.keys(cpuNames).reduce((final: any, key: string) => ({
          ...final,
          [key]: {
            value: item.cpu.subprocesses.subprocesses[key]?.collective || 0,
            taskThreads: Object.entries<number>(item.cpu.subprocesses.subprocesses[key]?.task_threads || {}).map(e => ({ name: e[0], value: e[1] })),
          },
        }), {
          'total': {
            value: Object.keys(cpuNames).reduce(
              (sum: number, key: string) => sum + (item.cpu.subprocesses.subprocesses[key]?.collective || 0),
              item.cpu.node.collective,
            ),
          },
          'node': {
            value: item.cpu.node.collective,
            taskThreads: Object.entries<number>(item.cpu.node.task_threads).map(e => ({ name: e[0], value: e[1] })),
          },
        }),
      });
      resources.memory.push({
        timestamp,
        pathPoints: Object.keys(memoryNames).reduce((final: any, key: string) => ({
          ...final,
          [key]: {
            value: item.memory.subprocesses.subprocesses[key] / GB_DIVISOR || 0,
          },
        }), {
          'total': {
            value: Object.keys(memoryNames).reduce(
              (sum: number, key: string) => sum + (item.memory.subprocesses.subprocesses[key] / GB_DIVISOR || 0),
              item.memory.node / GB_DIVISOR,
            ),
          },
          'node': {
            value: item.memory.node / GB_DIVISOR,
          },
        }),
      });
      resources.io.push({
        timestamp,
        pathPoints: Object.keys(ioNames).reduce((final: any, key: string) => ({
          ...final,
          [key + ' read']: {
            value: item.io.subprocesses.subprocesses[key]?.read_bytes_per_sec / MB_DIVISOR || 0,
          },
          [key + ' write']: {
            value: item.io.subprocesses.subprocesses[key]?.written_bytes_per_sec / MB_DIVISOR || 0,
          },
        }), {
          'total read': {
            value: Object.keys(ioNames).reduce(
              (sum: number, key: string) => sum + (item.io.subprocesses.subprocesses[key]?.read_bytes_per_sec / MB_DIVISOR || 0),
              item.io.node.read_bytes_per_sec / MB_DIVISOR,
            ),
          },
          'total write': {
            value: Object.keys(ioNames).reduce(
              (sum: number, key: string) => sum + (item.io.subprocesses.subprocesses[key]?.written_bytes_per_sec / MB_DIVISOR || 0),
              item.io.node.written_bytes_per_sec / MB_DIVISOR,
            ),
          },
          'node read': {
            value: item.io.node.read_bytes_per_sec / MB_DIVISOR,
          },
          'node write': {
            value: item.io.node.written_bytes_per_sec / MB_DIVISOR,
          },
        }),
      });
      resources.network.push({
        timestamp,
        pathPoints: Object.keys(networkNames).reduce((final: any, key: string) => ({
          ...final,
          [key + ' received']: {
            value: item.network.subprocesses.subprocesses[key]?.received_bytes_per_sec / MB_DIVISOR || 0,
          },
          [key + ' sent']: {
            value: item.network.subprocesses.subprocesses[key]?.sent_bytes_per_sec / MB_DIVISOR || 0,
          },
        }), {
          'total received': {
            value: Object.keys(networkNames).reduce(
              (sum: number, key: string) => sum + (item.network.subprocesses.subprocesses[key]?.received_bytes_per_sec / MB_DIVISOR || 0),
              item.network.node.received_bytes_per_sec / MB_DIVISOR,
            ),
          },
          'total sent': {
            value: Object.keys(networkNames).reduce(
              (sum: number, key: string) => sum + (item.network.subprocesses.subprocesses[key]?.sent_bytes_per_sec / MB_DIVISOR || 0),
              item.network.node.sent_bytes_per_sec / MB_DIVISOR,
            ),
          },
          'node received': {
            value: item.network.node.received_bytes_per_sec / MB_DIVISOR,
          },
          'node sent': {
            value: item.network.node.sent_bytes_per_sec / MB_DIVISOR,
          },
        }),
      });
    });
    const getMax = (key: string) => niceYScale(0, Math.max(
      ...resources[key].reduce((acc: number[], curr: SystemResourcesPoint) => [...acc, ...Object.values(curr.pathPoints).map(v => v.value)], []),
    ), 3)[1];
    resources.cpuMax = getMax('cpu');
    resources.memoryMax = getMax('memory');
    resources.ioMax = getMax('io');
    resources.networkMax = getMax('network');
    return resources;
  }
}
