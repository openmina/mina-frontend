import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  selectSystemResourcesActivePoint,
  selectSystemResourcesColorMapping,
  selectSystemResourcesData,
  SystemResourcesState,
} from '@resources/system/system-resources.state';
import { distinctUntilChanged, filter, take } from 'rxjs';
import { SystemResourcesChartData } from '@shared/types/resources/system/system-resources-chart-data.type';
import { SystemResourcesColorMapping } from '@shared/types/resources/system/system-resources-color-mapping.type';
import { selectSystemResourcesState } from '@resources/resources.state';
import { SystemResourcesActivePoint } from '@shared/types/resources/system/system-resources-active-point.type';
import { Router } from '@angular/router';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-system-resources-graph-list',
  templateUrl: './system-resources-graph-list.component.html',
  styleUrls: ['./system-resources-graph-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column overflow-y-scroll h-100 p-12 overflow-x-hidden' },
})
export class SystemResourcesGraphListComponent extends StoreDispatcher implements OnInit {

  resources: SystemResourcesChartData = {} as SystemResourcesChartData;
  colors: SystemResourcesColorMapping;
  cpuPaths: string[] = [];
  memoryPaths: string[] = [];
  ioPaths: string[] = [];
  networkPaths: string[] = [];
  activePointFromUrl: SystemResourcesActivePoint;
  activePointTitle: string;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToResourcesChanges();
    this.listenToColorsChanges();
    this.addTimeInRoute();
    this.listenToActiveResourceChange();
  }

  private listenToResourcesChanges(): void {
    this.select(selectSystemResourcesData, (resources: SystemResourcesChartData) => {
        this.resources = resources;
        this.cpuPaths = Object.keys(resources.cpu[resources.cpu.length - 1].pathPoints);
        this.memoryPaths = Object.keys(resources.memory[resources.memory.length - 1].pathPoints);
        this.ioPaths = Object.keys(resources.io[resources.io.length - 1].pathPoints);
        this.networkPaths = Object.keys(resources.network[resources.network.length - 1].pathPoints);
        this.detect();
      },
      distinctUntilChanged(),
      filter(resources => resources.cpu.length > 0),
    );
  }

  private addTimeInRoute(): void {
    this.select(selectSystemResourcesState, (state: SystemResourcesState) => {
        this.activePointFromUrl = state.activePoint;
        this.router.navigate(['resources', 'system'], {
          queryParams: {
            timestamp: this.activePointFromUrl.point.timestamp,
          },
          queryParamsHandling: 'merge',
        });
        this.detect();
      },
      filter(state => !!state.activeTime && !!state.activePoint),
      take(1),
    );
  }

  private listenToColorsChanges(): void {
    this.select(selectSystemResourcesColorMapping, (colorMapping: SystemResourcesColorMapping) => {
      this.colors = colorMapping;
      this.detect();
    });
  }

  private listenToActiveResourceChange(): void {
    this.select(selectSystemResourcesActivePoint, (point: SystemResourcesActivePoint) => {
      this.activePointTitle = point.title;
      this.detect();
    }, filter(Boolean));
  }
}
