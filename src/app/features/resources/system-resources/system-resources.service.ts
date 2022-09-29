import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

const MB_DIVISOR = 1048576;
const GB_DIVISOR = 1073741824;

@Injectable({
  providedIn: 'root',
})
export class SystemResourcesService {

  constructor(private http: HttpClient) { }

  getResources(): Observable<any> {
    return this.http.get<any[]>('https://develop.dev.tezedge.com:38732/resources/tezedge').pipe(
      map(response => SystemResourcesService.mapSystemResourcesResponse(response)),
    );
  }

  private static mapSystemResourcesResponse(response: any[]): any {
    const resources: any = {
      cpu: [],
      memory: [],
      storage: [],
      network: [],
    };

    response.reverse().forEach(item => {
      const timestamp = item.timestamp * 1000;

      resources.cpu.push({
        timestamp,
        node: item.cpu.node.collective,
        validators: item.cpu.validators.total,
        total: item.cpu.node.collective + item.cpu.validators.total,
      });

      resources.memory.push({
        timestamp,
        node: item.memory.node / GB_DIVISOR,
        validators: item.memory.validators.total / GB_DIVISOR,
        total: (item.memory.node + item.memory.validators.total) / GB_DIVISOR,
      });

      resources.storage.push({
        timestamp,
        blockStorage: item.disk.blockStorage / GB_DIVISOR,
        contextStorage: item.disk.contextStorage / GB_DIVISOR,
        mainDb: item.disk.mainDb / GB_DIVISOR,
        debugger: item.disk.debugger / GB_DIVISOR,
        stats: item.disk.contextStats / GB_DIVISOR,
        total: (item.disk.blockStorage + item.disk.contextStorage + item.disk.mainDb + item.disk.debugger + item.disk.contextStats) / GB_DIVISOR,
      });
      resources.network.push({
        timestamp,
        sent: item.network.sentBytesPerSec / MB_DIVISOR,
        received: item.network.receivedBytesPerSec / MB_DIVISOR,
      });
    });

    return resources
  }
}
