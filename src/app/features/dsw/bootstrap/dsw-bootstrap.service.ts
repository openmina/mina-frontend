import { Injectable } from '@angular/core';
import { DswDashboardService } from '@dsw/dashboard/dsw-dashboard.service';
import { map, Observable } from 'rxjs';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';
import { DswDashboardNodeBlockStatus } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';

@Injectable({
  providedIn: 'root',
})
export class DswBootstrapService {

  constructor(private dswDashboardService: DswDashboardService) { }

  getBootstrapNodeTips(): Observable<DswBootstrapNode[]> {
    return this.dswDashboardService.getNodeTips('Node 1').pipe(
      map((nodes: DswDashboardNode[]) => nodes.map((node: DswDashboardNode, index: number) => {
        const appliedBlocks = node.blocks.filter((block) => block.status === DswDashboardNodeBlockStatus.APPLIED);
        const fetchedBlocks = node.blocks.filter((block) => block.status === DswDashboardNodeBlockStatus.FETCHED);
        console.log(appliedBlocks.map((block) => block.applyDuration));
        return ({
          ...node,
          index,
          appliedBlocksAvg: appliedBlocks.reduce((sum, block) => sum + block.applyDuration, 0) / (appliedBlocks.length || 1),
          appliedBlocksMin: Math.min(...appliedBlocks.map((block) => block.applyDuration), 0),
          appliedBlocksMax: Math.max(...appliedBlocks.map((block) => block.applyDuration), 0),
          fetchedBlocksAvg: fetchedBlocks.reduce((sum, block) => sum + block.fetchDuration, 0) / (fetchedBlocks.length || 1),
          fetchedBlocksMin: Math.min(...fetchedBlocks.map((block) => block.fetchDuration), 0),
          fetchedBlocksMax: Math.max(...fetchedBlocks.map((block) => block.fetchDuration), 0),
          globalSlot: node.blocks[0].globalSlot,
          height: node.blocks[0].height,
        } as DswBootstrapNode);
      })),
    );
  }
}
