import { Injectable } from '@angular/core';
import { GraphQLService } from '@core/services/graph-ql.service';
import { map, Observable, of } from 'rxjs';
import { TracingOverviewCheckpoint } from '@shared/types/tracing/overview/tracing-overview-checkpoint.type';
import { TracingOverviewCheckpointColumn } from '@shared/types/tracing/overview/tracing-overview-checkpoint-column.type';

@Injectable({
  providedIn: 'root',
})
export class TracingOverviewService {

  constructor(private graphQL: GraphQLService) { }

  getStatistics(): Observable<TracingOverviewCheckpoint[]> {
    return this.graphQL.query<any>('blockTracesDistribution', '{ blockTracesDistribution }').pipe(
      map(response => this.mapStatisticsResponse(response.blockTracesDistribution)),
    );
  }

  private mapStatisticsResponse(response: any[]): TracingOverviewCheckpoint[] {
    return response.reverse().map(r => ({
      title: r.checkpoint.split('_').join(' '),
      totalTime: r.totalTime,
      totalCount: r.count,
      columns: this.getColumns(r),
    }));
  }

  private getColumns(response: any): TracingOverviewCheckpointColumn[] {
    delete response.checkpoint;
    delete response.totalTime;
    delete response.count;
    return Object.keys(response).map((key: string) => ({
      totalTime: response[key].totalTime,
      meanTime: response[key].meanTime,
      maxTime: response[key].maxTime,
      count: response[key].count,
      squareCount: this.getSquareCount(response[key].totalTime),
    } as TracingOverviewCheckpointColumn));
  }

  private getSquareCount(totalTimeInSeconds: number): number {
    const TEN_MICROSECONDS_FACTOR = 100000;
    let squareCount = 0;
    let timeInTenMicroseconds = totalTimeInSeconds * TEN_MICROSECONDS_FACTOR;
    while (timeInTenMicroseconds > 1) {
      timeInTenMicroseconds /= 10;
      squareCount++;
    }
    return Math.min(squareCount, 9);
  }
}
