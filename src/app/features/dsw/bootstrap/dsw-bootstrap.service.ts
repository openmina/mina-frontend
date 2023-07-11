import { Injectable } from '@angular/core';
import { DswDashboardService } from '@dsw/dashboard/dsw-dashboard.service';
import { map, Observable } from 'rxjs';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';

@Injectable({
  providedIn: 'root',
})
export class DswBootstrapService {

  constructor(private dswDashboardService: DswDashboardService) { }

  getBlocks(): Observable<DswDashboardNode> {
    return this.dswDashboardService.getNodes().pipe(
      map((nodes: DswDashboardNode[]) => nodes[0]),
    );
  }
}
