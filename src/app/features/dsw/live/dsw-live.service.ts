import { Injectable } from '@angular/core';
import { DswDashboardService } from '@dsw/dashboard/dsw-dashboard.service';
import { map, Observable } from 'rxjs';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { DswLiveNode } from '@shared/types/dsw/live/dsw-live-node.type';
import { DswLiveBlockEvent } from '@shared/types/dsw/live/dsw-live-block-event.type';
import { DswDashboardBlock } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

@Injectable({
  providedIn: 'root',
})
export class DswLiveService {

  constructor(private dswDashboardService: DswDashboardService) { }

  getLiveNodeTips(): Observable<DswLiveNode[]> {
    return this.dswDashboardService.getNodeTips('Node 1').pipe(
      map((nodes: DswDashboardNode[]) => nodes.reverse().map((node: DswDashboardNode, index: number) => {
        return ({
          ...node,
          index,
          events: this.getEvents(node),
        } as DswLiveNode);
      })),
    );
  }

  private getEvents(node: DswDashboardNode): DswLiveBlockEvent[] {
    const events: DswLiveBlockEvent[] = [];

    node.blocks.forEach((block: DswDashboardBlock, index: number) => {
      const event = {} as DswLiveBlockEvent;
      event.timestamp = 1;
      event.datetime = '2020-01-01 00:00:00';
      event.status = 'success';
      event.height = block.height;
      event.elapsed = 1;
      event.message = 'message';
      events.push(event);
    });

    return events;
  }
}
