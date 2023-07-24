import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { DswActionGroupAction } from '@shared/types/dsw/actions/dsw-action-group-action.type';
import { DswActionColumn } from '@shared/types/dsw/actions/dsw-action-column.type';
import { NANOSEC_IN_1_SEC, ONE_MILLION } from '@shared/constants/unit-measurements';
import { HttpClient } from '@angular/common/http';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';
import { toReadableDate } from '@shared/helpers/date.helper';

@Injectable({
  providedIn: 'root',
})
export class DswActionsService {

  constructor(private http: HttpClient) { }

  getEarliestSlot(): Observable<number> {
    return this.http.get<any>('http://webrtc2.webnode.openmina.com:10000/stats/actions?id=latest').pipe(
      map(res => res.id),
    );
  }

  getActions(slot: number): Observable<[DswActionsStats, DswActionGroup[]]> {
    // return of(JSON.parse(JSON.stringify(mock))).pipe(
    return this.http.get<any>(`http://webrtc2.webnode.openmina.com:10000/stats/actions?id=${slot}`).pipe(
      map(res => [this.mapDswStats(res), this.mapDswActions(res.stats)]),
    );
  }

  private mapDswStats(response: any): DswActionsStats {
    return {
      hash: response.block_hash,
      level: response.block_level,
      time: response.time ? toReadableDate(response.time / ONE_MILLION) : '-',
      cpuBusy: response.cpu_busy,
      cpuIdle: response.cpu_idle,
    } as DswActionsStats;
  }

  private mapDswActions(response: any): DswActionGroup[] {
    this.convertTimesToSeconds(response);
    const groupNames = this.getGroupNames(response);
    return Object.keys(groupNames)
      .map((groupName: string) => {
        const actions: DswActionGroupAction[] = Object
          .keys(response)
          .filter(actionName => groupNames[groupName].includes(actionName))
          .map(actionName => {
            const columns: DswActionColumn[] = Object.keys(response[actionName]).map(range => ({
              count: response[actionName][range].total_calls,
              totalTime: response[actionName][range].total_duration,
              maxTime: response[actionName][range].max_duration,
              meanTime: this.getMeanTime(response[actionName][range].total_duration, response[actionName][range].total_calls),
              squareCount: this.getSquareCount(response[actionName][range].total_calls),
            }));
            const totalCount = columns.reduce((acc: number, curr: DswActionColumn) => acc + curr.count, 0);
            const totalTime = columns.reduce((acc: number, curr: DswActionColumn) => acc + curr.totalTime, 0);
            return {
              title: actionName !== groupName ? actionName.replace(groupName, '') : '-',
              fullTitle: actionName,
              totalCount,
              totalTime,
              meanTime: this.getMeanTime(totalTime, totalCount),
              columns,
              display: true,
            };
          });
        const count = actions.reduce((acc: number, curr: DswActionGroupAction) => acc + curr.totalCount, 0);
        const totalTime = actions.reduce((acc: number, curr: DswActionGroupAction) => acc + curr.totalTime, 0);
        return {
          groupName,
          actions,
          count,
          totalTime,
          meanTime: this.getMeanTime(totalTime, count),
          display: true,
        };
      });
  }

  private getMeanTime(duration: number, calls: number): number {
    if (duration !== 0 && calls !== 0) {
      return duration / calls;
    }
    return 0;
  }

  private getGroupNames(stats: any): { [p: string]: string[] } {
    let finalGroups: { [p: string]: string[] };
    let usedActions: { [p: string]: boolean };
    const statsActionNames = Object.keys(stats);
    const prefixGroups: { [p: string]: string[] } = statsActionNames
      .reduce((groups: { [p: string]: string[] }, actionName: string) => {
        const nameSlices: string[] = actionName.split(/(?=[A-Z])/);
        nameSlices.reduce((sliceBuildup: string, slice: string) => {
          sliceBuildup = sliceBuildup + slice;
          groups[sliceBuildup] = groups[sliceBuildup] || [];
          groups[sliceBuildup].push(actionName);
          return sliceBuildup;
        }, '');
        return groups;
      }, {});
    const sortedGroups: [string, string[]][] = Object.entries(prefixGroups).sort((a, b) => b[0].length - a[0].length);
    [finalGroups, usedActions] = sortedGroups
      .filter(([groups, items]) => items.length > 1)
      .reduce((
        [groups, usedActionsParam]: [groups: { [p: string]: string[] }, usedActionsParam: { [p: string]: boolean }],
        [groupName, actions]: [groupName: string, actions: string[]],
      ) => {
        actions = actions.filter((actionName: string) => !usedActionsParam[actionName]);
        if (actions.length > 1) {
          groups[groupName] = actions;
          usedActionsParam = actions.reduce((r, actionName: string) => ({
            ...r,
            [actionName]: true,
          }), usedActionsParam);
        }
        return [groups, usedActionsParam];
      }, [{}, {}]);
    const ungroupedActions = statsActionNames.filter((actionName: string) => !usedActions[actionName]);
    const ungrouped = ungroupedActions.reduce((ungroupedObject: { [p: string]: string[] }, name: string) => ({
      ...ungroupedObject,
      [name]: [name],
    }), {});
    return ({ ...finalGroups, ...ungrouped });
  }

  private getSquareCount(calls: number): number {
    let squareCount = 0;
    while (calls >= 1) {
      calls /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 8);
  }

  private convertTimesToSeconds(response: any): void {
    Object.keys(response).forEach(key => {
      Object.keys(response[key]).forEach(timeKey => {
        response[key][timeKey].total_duration /= NANOSEC_IN_1_SEC;
        response[key][timeKey].max_duration /= NANOSEC_IN_1_SEC;
      });
    });
  }
}
