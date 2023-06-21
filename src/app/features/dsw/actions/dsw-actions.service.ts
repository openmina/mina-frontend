import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
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
              title: actionName,
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


const mock = {
  'MempoolValidatorPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 327,
      'total_duration': 3063417,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 30330,
      'total_duration': 577679159,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 181,
      'total_duration': 10933600,
      'max_duration': 99480,
    },
    'under_500_us': {
      'total_calls': 4,
      'total_duration': 620012,
      'max_duration': 240180,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1627564,
      'max_duration': 843206,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionOutgoingRandomInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 6928,
      'total_duration': 56942367,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 157990,
      'total_duration': 3410859277,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 29004,
      'total_duration': 1940334072,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 2904,
      'total_duration': 388226389,
      'max_duration': 494780,
    },
    'under_1_ms': {
      'total_calls': 46,
      'total_duration': 31052660,
      'max_duration': 941903,
    },
    'under_5_ms': {
      'total_calls': 19,
      'total_duration': 43147533,
      'max_duration': 4975970,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 8664190,
      'max_duration': 8664190,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWriteCreateChunk': {
    'under_1_us': {
      'total_calls': 3016284,
      'total_duration': 2522478138,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 58925107,
      'total_duration': 114578574855,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 444869,
      'total_duration': 9647516367,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 40730,
      'total_duration': 2747820158,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 12416,
      'total_duration': 1953276824,
      'max_duration': 499719,
    },
    'under_1_ms': {
      'total_calls': 424,
      'total_duration': 292675294,
      'max_duration': 998457,
    },
    'under_5_ms': {
      'total_calls': 124,
      'total_duration': 201992611,
      'max_duration': 4529845,
    },
    'above_5_ms': {
      'total_calls': 4,
      'total_duration': 30513548,
      'max_duration': 8384563,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorValidatePending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 280862,
      'total_duration': 2195937969,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1051249,
      'total_duration': 17076936368,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 17555,
      'total_duration': 1250822246,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 4712,
      'total_duration': 718969600,
      'max_duration': 499478,
    },
    'under_1_ms': {
      'total_calls': 763,
      'total_duration': 511719778,
      'max_duration': 998706,
    },
    'under_5_ms': {
      'total_calls': 142,
      'total_duration': 263283480,
      'max_duration': 4594365,
    },
    'above_5_ms': {
      'total_calls': 16,
      'total_duration': 127899474,
      'max_duration': 20188890,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolOperationDecoded': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 11644986,
      'total_duration': 79500279464,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1438905,
      'total_duration': 24375771388,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 100189,
      'total_duration': 6945659185,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 27750,
      'total_duration': 3793922877,
      'max_duration': 499870,
    },
    'under_1_ms': {
      'total_calls': 632,
      'total_duration': 422360718,
      'max_duration': 989548,
    },
    'under_5_ms': {
      'total_calls': 215,
      'total_duration': 470233449,
      'max_duration': 4993836,
    },
    'above_5_ms': {
      'total_calls': 14,
      'total_duration': 99232507,
      'max_duration': 10868448,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlockHeaderGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30781,
      'total_duration': 77861358,
      'max_duration': 9981,
    },
    'under_50_us': {
      'total_calls': 64,
      'total_duration': 1145130,
      'max_duration': 41884,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 50821,
      'max_duration': 50821,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersAddMulti': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 986,
      'total_duration': 38424013,
      'max_duration': 49950,
    },
    'under_100_us': {
      'total_calls': 1466,
      'total_duration': 104684685,
      'max_duration': 99771,
    },
    'under_500_us': {
      'total_calls': 1532,
      'total_duration': 294313194,
      'max_duration': 497625,
    },
    'under_1_ms': {
      'total_calls': 20,
      'total_duration': 12938753,
      'max_duration': 979801,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitRuntime': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 102575,
      'max_duration': 102575,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockHeaderGetFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 10906,
      'total_duration': 99683775,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 19661,
      'total_duration': 240571683,
      'max_duration': 49950,
    },
    'under_100_us': {
      'total_calls': 162,
      'total_duration': 10719478,
      'max_duration': 99148,
    },
    'under_500_us': {
      'total_calls': 114,
      'total_duration': 19866830,
      'max_duration': 463817,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1498648,
      'max_duration': 1498648,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockOperationsGetNext': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 27655,
      'total_duration': 154743036,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 2274,
      'total_duration': 44429358,
      'max_duration': 49959,
    },
    'under_100_us': {
      'total_calls': 759,
      'total_duration': 51353576,
      'max_duration': 99980,
    },
    'under_500_us': {
      'total_calls': 154,
      'total_duration': 23346761,
      'max_duration': 398086,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1241032,
      'max_duration': 637014,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockOperationsGetSuccess': {
    'under_1_us': {
      'total_calls': 15,
      'total_duration': 14576,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 45294,
      'total_duration': 189804289,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 16263,
      'total_duration': 399486755,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 7771,
      'total_duration': 562774022,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 14683,
      'total_duration': 3611444920,
      'max_duration': 499939,
    },
    'under_1_ms': {
      'total_calls': 1198,
      'total_duration': 728511022,
      'max_duration': 998606,
    },
    'under_5_ms': {
      'total_calls': 77,
      'total_duration': 108135952,
      'max_duration': 4927070,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 5850567,
      'max_duration': 5850567,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionIncomingRejected': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 10608,
      'total_duration': 446222392,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 84597,
      'total_duration': 6489420871,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 29835,
      'total_duration': 3665993477,
      'max_duration': 498266,
    },
    'under_1_ms': {
      'total_calls': 19,
      'total_duration': 12635742,
      'max_duration': 903968,
    },
    'under_5_ms': {
      'total_calls': 22,
      'total_duration': 44603749,
      'max_duration': 4371078,
    },
    'above_5_ms': {
      'total_calls': 10,
      'total_duration': 107012380,
      'max_duration': 18052164,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerMessageReadSuccess': {
    'under_1_us': {
      'total_calls': 4,
      'total_duration': 3798,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 2499718,
      'total_duration': 14781884460,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 78775580,
      'total_duration': 2597019777123,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 52871327,
      'total_duration': 3718745695416,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 20000055,
      'total_duration': 3015568597096,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 211684,
      'total_duration': 140508314645,
      'max_duration': 999999,
    },
    'under_5_ms': {
      'total_calls': 60910,
      'total_duration': 109295543494,
      'max_duration': 4999555,
    },
    'above_5_ms': {
      'total_calls': 1617,
      'total_duration': 11726222785,
      'max_duration': 44401156,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageResponseReceived': {
    'under_1_us': {
      'total_calls': 156358,
      'total_duration': 134711447,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 3180844,
      'total_duration': 7151113813,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 29913,
      'total_duration': 650354087,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 18129,
      'total_duration': 1392325561,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 28847,
      'total_duration': 4765140933,
      'max_duration': 499118,
    },
    'under_1_ms': {
      'total_calls': 249,
      'total_duration': 165983544,
      'max_duration': 998767,
    },
    'under_5_ms': {
      'total_calls': 2166,
      'total_duration': 5951946190,
      'max_duration': 4994067,
    },
    'above_5_ms': {
      'total_calls': 27,
      'total_duration': 163225477,
      'max_duration': 9283548,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetInit': {
    'under_1_us': {
      'total_calls': 5,
      'total_duration': 4408,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 16726,
      'total_duration': 58606388,
      'max_duration': 9959,
    },
    'under_50_us': {
      'total_calls': 116,
      'total_duration': 2635613,
      'max_duration': 49509,
    },
    'under_100_us': {
      'total_calls': 9,
      'total_duration': 651122,
      'max_duration': 95882,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 875721,
      'max_duration': 492755,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolOperationInject': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 383,
      'total_duration': 12890306,
      'max_duration': 49979,
    },
    'under_100_us': {
      'total_calls': 164,
      'total_duration': 11119830,
      'max_duration': 99819,
    },
    'under_500_us': {
      'total_calls': 28,
      'total_duration': 3570037,
      'max_duration': 257715,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 779458,
      'max_duration': 779458,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerPrecheckOperation': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 12888617,
      'total_duration': 67462611521,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 307582,
      'total_duration': 5060486811,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 13479,
      'total_duration': 896041846,
      'max_duration': 99989,
    },
    'under_500_us': {
      'total_calls': 2593,
      'total_duration': 438017394,
      'max_duration': 497946,
    },
    'under_1_ms': {
      'total_calls': 373,
      'total_duration': 246582502,
      'max_duration': 994579,
    },
    'under_5_ms': {
      'total_calls': 45,
      'total_duration': 80605953,
      'max_duration': 4876168,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 20205661,
      'max_duration': 12856730,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockOperationsGetEnqueue': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 103840,
      'total_duration': 398907824,
      'max_duration': 9990,
    },
    'under_50_us': {
      'total_calls': 1916,
      'total_duration': 42938461,
      'max_duration': 49790,
    },
    'under_100_us': {
      'total_calls': 173,
      'total_duration': 11233325,
      'max_duration': 97876,
    },
    'under_500_us': {
      'total_calls': 33,
      'total_duration': 6046373,
      'max_duration': 429369,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 614649,
      'max_duration': 614649,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlockAdditionalDataGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30780,
      'total_duration': 90086314,
      'max_duration': 9740,
    },
    'under_50_us': {
      'total_calls': 64,
      'total_duration': 1183836,
      'max_duration': 47034,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 56553,
      'max_duration': 56553,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 159610,
      'max_duration': 159610,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerStoreEndorsementBranch': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30714,
      'total_duration': 101932511,
      'max_duration': 9991,
    },
    'under_50_us': {
      'total_calls': 128,
      'total_duration': 2318803,
      'max_duration': 49480,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 80371,
      'max_duration': 80371,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingAckMessageEncode': {
    'under_1_us': {
      'total_calls': 2,
      'total_duration': 1934,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 24276,
      'total_duration': 92982739,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 395,
      'total_duration': 9235149,
      'max_duration': 49950,
    },
    'under_100_us': {
      'total_calls': 58,
      'total_duration': 3688264,
      'max_duration': 97666,
    },
    'under_500_us': {
      'total_calls': 8,
      'total_duration': 2109048,
      'max_duration': 413167,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 2005580,
      'max_duration': 742495,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplySuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 3734,
      'total_duration': 1637968161,
      'max_duration': 499979,
    },
    'under_1_ms': {
      'total_calls': 24446,
      'total_duration': 17236018688,
      'max_duration': 999909,
    },
    'under_5_ms': {
      'total_calls': 2662,
      'total_duration': 3319194743,
      'max_duration': 4033796,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 11483957,
      'max_duration': 5997229,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolOperationRecvDone': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 374378,
      'total_duration': 3175936520,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 13392543,
      'total_duration': 253045087022,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 130596,
      'total_duration': 8323694334,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 17233,
      'total_duration': 2689412237,
      'max_duration': 499729,
    },
    'under_1_ms': {
      'total_calls': 1664,
      'total_duration': 1107665958,
      'max_duration': 997444,
    },
    'under_5_ms': {
      'total_calls': 193,
      'total_duration': 331251113,
      'max_duration': 4815046,
    },
    'above_5_ms': {
      'total_calls': 10,
      'total_duration': 77284954,
      'max_duration': 17328355,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsGetProtocolConstants': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 29820,
      'total_duration': 111422630,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1016,
      'total_duration': 15023965,
      'max_duration': 49449,
    },
    'under_100_us': {
      'total_calls': 8,
      'total_duration': 488870,
      'max_duration': 76393,
    },
    'under_500_us': {
      'total_calls': 2,
      'total_duration': 287645,
      'max_duration': 152976,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersConnectSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1763,
      'max_duration': 1763,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRequestsPotentialPeersGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 324,
      'total_duration': 13419195,
      'max_duration': 49920,
    },
    'under_100_us': {
      'total_calls': 1473,
      'total_duration': 99787089,
      'max_duration': 99880,
    },
    'under_500_us': {
      'total_calls': 191,
      'total_duration': 38946826,
      'max_duration': 485401,
    },
    'under_1_ms': {
      'total_calls': 1088,
      'total_duration': 792539173,
      'max_duration': 998445,
    },
    'under_5_ms': {
      'total_calls': 781,
      'total_duration': 1599522646,
      'max_duration': 4979204,
    },
    'above_5_ms': {
      'total_calls': 147,
      'total_duration': 1189065683,
      'max_duration': 18000012,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageWriteSetContent': {
    'under_1_us': {
      'total_calls': 705545,
      'total_duration': 670639374,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 61342121,
      'total_duration': 159771865016,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 310796,
      'total_duration': 7632340177,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 42513,
      'total_duration': 2868341742,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 9965,
      'total_duration': 1543676287,
      'max_duration': 498878,
    },
    'under_1_ms': {
      'total_calls': 429,
      'total_duration': 295087740,
      'max_duration': 998878,
    },
    'under_5_ms': {
      'total_calls': 106,
      'total_duration': 167696051,
      'max_duration': 4157420,
    },
    'above_5_ms': {
      'total_calls': 6,
      'total_duration': 36620713,
      'max_duration': 7858289,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageConstantsGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 27458,
      'total_duration': 112422719,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 3339,
      'total_duration': 55573962,
      'max_duration': 49829,
    },
    'under_100_us': {
      'total_calls': 46,
      'total_duration': 2839020,
      'max_duration': 94880,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 487736,
      'max_duration': 266633,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageRequestInit': {
    'under_1_us': {
      'total_calls': 15730,
      'total_duration': 13755982,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 1385615,
      'total_duration': 7450016827,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1269907,
      'total_duration': 17886394724,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 247979,
      'total_duration': 19169500492,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 478871,
      'total_duration': 68776917346,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 11614,
      'total_duration': 8338136220,
      'max_duration': 999780,
    },
    'under_5_ms': {
      'total_calls': 6805,
      'total_duration': 11510205165,
      'max_duration': 4949866,
    },
    'above_5_ms': {
      'total_calls': 12,
      'total_duration': 86433806,
      'max_duration': 10574779,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockOperationsGetInitNext': {
    'under_1_us': {
      'total_calls': 258,
      'total_duration': 232565,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 84929,
      'total_duration': 271307868,
      'max_duration': 9980,
    },
    'under_50_us': {
      'total_calls': 486,
      'total_duration': 11345095,
      'max_duration': 49479,
    },
    'under_100_us': {
      'total_calls': 39,
      'total_duration': 2552049,
      'max_duration': 99249,
    },
    'under_500_us': {
      'total_calls': 11,
      'total_duration': 1708457,
      'max_duration': 278808,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 788055,
      'max_duration': 788055,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageWriteReady': {
    'under_1_us': {
      'total_calls': 6850810,
      'total_duration': 5383701993,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 55402465,
      'total_duration': 88888210543,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 144881,
      'total_duration': 3254890388,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11322,
      'total_duration': 751691033,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 1710,
      'total_duration': 252901602,
      'max_duration': 499538,
    },
    'under_1_ms': {
      'total_calls': 157,
      'total_duration': 105397320,
      'max_duration': 949650,
    },
    'under_5_ms': {
      'total_calls': 54,
      'total_duration': 95124524,
      'max_duration': 4313873,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 13455000,
      'max_duration': 8077339,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRequestsPotentialPeersGetInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 14590,
      'max_duration': 7916,
    },
    'under_50_us': {
      'total_calls': 1418,
      'total_duration': 55544783,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 1952,
      'total_duration': 124210085,
      'max_duration': 99840,
    },
    'under_500_us': {
      'total_calls': 144,
      'total_duration': 30209870,
      'max_duration': 494207,
    },
    'under_1_ms': {
      'total_calls': 373,
      'total_duration': 275136068,
      'max_duration': 994078,
    },
    'under_5_ms': {
      'total_calls': 154,
      'total_duration': 273050843,
      'max_duration': 4932329,
    },
    'above_5_ms': {
      'total_calls': 29,
      'total_duration': 216456685,
      'max_duration': 15293596,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerCurrentBranchReceived': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 2,
      'total_duration': 507603,
      'max_duration': 274077,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorValidateInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 21073,
      'total_duration': 173193981,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 796567,
      'total_duration': 22325003339,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 393994,
      'total_duration': 28514884045,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 127489,
      'total_duration': 17518647471,
      'max_duration': 499970,
    },
    'under_1_ms': {
      'total_calls': 14124,
      'total_duration': 9373703171,
      'max_duration': 999950,
    },
    'under_5_ms': {
      'total_calls': 1893,
      'total_duration': 3503023984,
      'max_duration': 4999864,
    },
    'above_5_ms': {
      'total_calls': 159,
      'total_duration': 1400533682,
      'max_duration': 23027233,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersGraylistIpAdded': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 32567,
      'total_duration': 185531812,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 17278,
      'total_duration': 248165267,
      'max_duration': 49950,
    },
    'under_100_us': {
      'total_calls': 93,
      'total_duration': 6566632,
      'max_duration': 99869,
    },
    'under_500_us': {
      'total_calls': 51,
      'total_duration': 9051218,
      'max_duration': 390030,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 2524167,
      'max_duration': 721923,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersCheckTimeoutsSuccess': {
    'under_1_us': {
      'total_calls': 108,
      'total_duration': 98103,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 4272754,
      'total_duration': 13328496810,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 21218,
      'total_duration': 674315967,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 18429,
      'total_duration': 1174274468,
      'max_duration': 99960,
    },
    'under_500_us': {
      'total_calls': 872,
      'total_duration': 153427825,
      'max_duration': 499519,
    },
    'under_1_ms': {
      'total_calls': 12902,
      'total_duration': 8919104786,
      'max_duration': 999979,
    },
    'under_5_ms': {
      'total_calls': 10393,
      'total_duration': 23634306416,
      'max_duration': 4999458,
    },
    'above_5_ms': {
      'total_calls': 1575,
      'total_duration': 13384027971,
      'max_duration': 21852889,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWritePart': {
    'under_1_us': {
      'total_calls': 867169,
      'total_duration': 780908316,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 60422934,
      'total_duration': 204038102457,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1107659,
      'total_duration': 17949129224,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 37462,
      'total_duration': 2442675321,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 4684,
      'total_duration': 694998752,
      'max_duration': 499889,
    },
    'under_1_ms': {
      'total_calls': 411,
      'total_duration': 275055302,
      'max_duration': 998225,
    },
    'under_5_ms': {
      'total_calls': 87,
      'total_duration': 148792960,
      'max_duration': 4872600,
    },
    'above_5_ms': {
      'total_calls': 6,
      'total_duration': 49981681,
      'max_duration': 17839661,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingMetadataMessageInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 24150,
      'total_duration': 115199708,
      'max_duration': 9999,
    },
    'under_50_us': {
      'total_calls': 738,
      'total_duration': 14610814,
      'max_duration': 49799,
    },
    'under_100_us': {
      'total_calls': 78,
      'total_duration': 4997156,
      'max_duration': 96853,
    },
    'under_500_us': {
      'total_calls': 15,
      'total_duration': 2698593,
      'max_duration': 408006,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 2499988,
      'max_duration': 769328,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1390210,
      'max_duration': 1390210,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockHeadersGetInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2975,
      'max_duration': 2975,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionIncomingAcceptError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 7827,
      'max_duration': 5843,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersRemove': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1156,
      'total_duration': 8611323,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 25862,
      'total_duration': 742984418,
      'max_duration': 49999,
    },
    'under_100_us': {
      'total_calls': 15004,
      'total_duration': 1090196516,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 37638,
      'total_duration': 8757086752,
      'max_duration': 499989,
    },
    'under_1_ms': {
      'total_calls': 5710,
      'total_duration': 3805757408,
      'max_duration': 998997,
    },
    'under_5_ms': {
      'total_calls': 3613,
      'total_duration': 9527074290,
      'max_duration': 4999950,
    },
    'above_5_ms': {
      'total_calls': 9698,
      'total_duration': 118312786149,
      'max_duration': 27150328,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerTryReadLoopStart': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 17574508,
      'total_duration': 109085532483,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 117705392,
      'total_duration': 2782631703615,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 2063353,
      'total_duration': 129011940860,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 133046,
      'total_duration': 19795931465,
      'max_duration': 499969,
    },
    'under_1_ms': {
      'total_calls': 23459,
      'total_duration': 16386429128,
      'max_duration': 999920,
    },
    'under_5_ms': {
      'total_calls': 3117,
      'total_duration': 4915044309,
      'max_duration': 4959058,
    },
    'above_5_ms': {
      'total_calls': 121,
      'total_duration': 1209354533,
      'max_duration': 27794469,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkReadError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 2,
      'total_duration': 89700,
      'max_duration': 48257,
    },
    'under_100_us': {
      'total_calls': 7,
      'total_duration': 460118,
      'max_duration': 92576,
    },
    'under_500_us': {
      'total_calls': 2,
      'total_duration': 333195,
      'max_duration': 201633,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 2465197,
      'max_duration': 749367,
    },
    'under_5_ms': {
      'total_calls': 6,
      'total_duration': 16643651,
      'max_duration': 4283946,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 13168389,
      'max_duration': 7841195,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolSend': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2904,
      'total_duration': 14825726,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 50346,
      'total_duration': 1863911575,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 198492,
      'total_duration': 15351277081,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 1166968,
      'total_duration': 275663503453,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 99482,
      'total_duration': 63747504592,
      'max_duration': 1000000,
    },
    'under_5_ms': {
      'total_calls': 16586,
      'total_duration': 29965216328,
      'max_duration': 4996102,
    },
    'above_5_ms': {
      'total_calls': 102,
      'total_duration': 581414295,
      'max_duration': 19013167,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolMarkOperationsAsPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 9900430,
      'total_duration': 66790439473,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1005691,
      'total_duration': 19702135887,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 248644,
      'total_duration': 17413958124,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 62416,
      'total_duration': 8185202079,
      'max_duration': 499719,
    },
    'under_1_ms': {
      'total_calls': 545,
      'total_duration': 377256507,
      'max_duration': 999910,
    },
    'under_5_ms': {
      'total_calls': 1018,
      'total_duration': 2735618337,
      'max_duration': 4971421,
    },
    'above_5_ms': {
      'total_calls': 34,
      'total_duration': 238330863,
      'max_duration': 16151640,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionClosed': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 83,
      'total_duration': 479946,
      'max_duration': 9579,
    },
    'under_50_us': {
      'total_calls': 13444,
      'total_duration': 534740659,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 7269,
      'total_duration': 447136106,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 750,
      'total_duration': 194731435,
      'max_duration': 499058,
    },
    'under_1_ms': {
      'total_calls': 9386,
      'total_duration': 6639540650,
      'max_duration': 999960,
    },
    'under_5_ms': {
      'total_calls': 10955,
      'total_duration': 25903985345,
      'max_duration': 4996357,
    },
    'above_5_ms': {
      'total_calls': 2544,
      'total_duration': 21569548191,
      'max_duration': 27674690,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersGraylistIpRemoved': {
    'under_1_us': {
      'total_calls': 1,
      'total_duration': 902,
      'max_duration': 902,
    },
    'under_10_us': {
      'total_calls': 25031,
      'total_duration': 111864558,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 22232,
      'total_duration': 603291679,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 1473,
      'total_duration': 89633599,
      'max_duration': 98877,
    },
    'under_500_us': {
      'total_calls': 81,
      'total_duration': 12302992,
      'max_duration': 356452,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1404388,
      'max_duration': 785751,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlocksGenesisCheckAppliedGetMetaPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 3856,
      'max_duration': 3856,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitRuntimePending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 22285,
      'max_duration': 22285,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockHeaderGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 6,
      'total_duration': 58229,
      'max_duration': 9971,
    },
    'under_50_us': {
      'total_calls': 20482,
      'total_duration': 694178966,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 8459,
      'total_duration': 552893324,
      'max_duration': 99979,
    },
    'under_500_us': {
      'total_calls': 1881,
      'total_duration': 262856486,
      'max_duration': 483597,
    },
    'under_1_ms': {
      'total_calls': 11,
      'total_duration': 7158583,
      'max_duration': 829549,
    },
    'under_5_ms': {
      'total_calls': 4,
      'total_duration': 8831563,
      'max_duration': 4639594,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 7369111,
      'max_duration': 7369111,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerTryReadLoopFinish': {
    'under_1_us': {
      'total_calls': 688,
      'total_duration': 605927,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 136693510,
      'total_duration': 565364192192,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 710524,
      'total_duration': 16681673484,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 83129,
      'total_duration': 5555387496,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 12951,
      'total_duration': 2027671732,
      'max_duration': 499919,
    },
    'under_1_ms': {
      'total_calls': 1236,
      'total_duration': 811403447,
      'max_duration': 993627,
    },
    'under_5_ms': {
      'total_calls': 240,
      'total_duration': 429454795,
      'max_duration': 4759550,
    },
    'above_5_ms': {
      'total_calls': 16,
      'total_duration': 145785358,
      'max_duration': 16451567,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWriteReady': {
    'under_1_us': {
      'total_calls': 6973177,
      'total_duration': 5502120574,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 55298753,
      'total_duration': 89765813744,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 154430,
      'total_duration': 3409815709,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11651,
      'total_duration': 770794462,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 1671,
      'total_duration': 256422771,
      'max_duration': 497515,
    },
    'under_1_ms': {
      'total_calls': 147,
      'total_duration': 98138380,
      'max_duration': 986874,
    },
    'under_5_ms': {
      'total_calls': 45,
      'total_duration': 82218173,
      'max_duration': 4957009,
    },
    'above_5_ms': {
      'total_calls': 4,
      'total_duration': 31583135,
      'max_duration': 9774905,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersConnectPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 39850,
      'max_duration': 39850,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionOutgoingInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 930,
      'total_duration': 38169737,
      'max_duration': 49991,
    },
    'under_100_us': {
      'total_calls': 25835,
      'total_duration': 2169034222,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 62231,
      'total_duration': 8129732586,
      'max_duration': 481042,
    },
    'under_1_ms': {
      'total_calls': 3914,
      'total_duration': 2903631026,
      'max_duration': 999918,
    },
    'under_5_ms': {
      'total_calls': 2995,
      'total_duration': 5042462474,
      'max_duration': 4989585,
    },
    'above_5_ms': {
      'total_calls': 567,
      'total_duration': 7056184208,
      'max_duration': 31289607,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersMainBranchFindPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 5781,
      'max_duration': 5781,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlocksGenesisCheckAppliedInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 15040,
      'max_duration': 15040,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockOperationsGetInit': {
    'under_1_us': {
      'total_calls': 10,
      'total_duration': 9626,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 24809,
      'total_duration': 84518271,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 3199,
      'total_duration': 62278511,
      'max_duration': 49980,
    },
    'under_100_us': {
      'total_calls': 2437,
      'total_duration': 170238897,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 387,
      'total_duration': 50194601,
      'max_duration': 463978,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 507364,
      'max_duration': 507364,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlockMetaOk': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 35521,
      'max_duration': 35521,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerDecodeOperation': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 10500721,
      'total_duration': 73603509212,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 2650340,
      'total_duration': 37491781825,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 49056,
      'total_duration': 3320126826,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 11853,
      'total_duration': 1718236111,
      'max_duration': 499889,
    },
    'under_1_ms': {
      'total_calls': 603,
      'total_duration': 397042810,
      'max_duration': 986984,
    },
    'under_5_ms': {
      'total_calls': 107,
      'total_duration': 215403107,
      'max_duration': 4968041,
    },
    'above_5_ms': {
      'total_calls': 11,
      'total_duration': 78923091,
      'max_duration': 19350687,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerNotifyStatus': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 43306,
      'max_duration': 43306,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolRpcEndorsementsStatusGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 3175,
      'total_duration': 66035310346,
      'max_duration': 36480085,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersGraylistIpAdd': {
    'under_1_us': {
      'total_calls': 5,
      'total_duration': 4130,
      'max_duration': 932,
    },
    'under_10_us': {
      'total_calls': 48837,
      'total_duration': 224227231,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1018,
      'total_duration': 18960962,
      'max_duration': 49139,
    },
    'under_100_us': {
      'total_calls': 99,
      'total_duration': 6666095,
      'max_duration': 99680,
    },
    'under_500_us': {
      'total_calls': 34,
      'total_duration': 5685430,
      'max_duration': 448116,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyPrepareDataPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30523,
      'total_duration': 158171653,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 282,
      'total_duration': 5807005,
      'max_duration': 48767,
    },
    'under_100_us': {
      'total_calls': 24,
      'total_duration': 1537544,
      'max_duration': 99749,
    },
    'under_500_us': {
      'total_calls': 7,
      'total_duration': 1528055,
      'max_duration': 458857,
    },
    'under_1_ms': {
      'total_calls': 5,
      'total_duration': 3328132,
      'max_duration': 840870,
    },
    'under_5_ms': {
      'total_calls': 3,
      'total_duration': 4302994,
      'max_duration': 1642253,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingMetadataMessageRead': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 24665,
      'total_duration': 100431643,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 276,
      'total_duration': 5755558,
      'max_duration': 49611,
    },
    'under_100_us': {
      'total_calls': 29,
      'total_duration': 2119818,
      'max_duration': 98677,
    },
    'under_500_us': {
      'total_calls': 13,
      'total_duration': 2434245,
      'max_duration': 452525,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1462313,
      'max_duration': 813897,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1983185,
      'max_duration': 1983185,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PausedLoopsAdd': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 16129,
      'total_duration': 65084459,
      'max_duration': 9849,
    },
    'under_50_us': {
      'total_calls': 70,
      'total_duration': 2004808,
      'max_duration': 49178,
    },
    'under_100_us': {
      'total_calls': 8,
      'total_duration': 513478,
      'max_duration': 83436,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 352945,
      'max_duration': 131242,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingMetadataMessageWrite': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 24672,
      'total_duration': 91699356,
      'max_duration': 9970,
    },
    'under_50_us': {
      'total_calls': 254,
      'total_duration': 5503583,
      'max_duration': 49278,
    },
    'under_100_us': {
      'total_calls': 47,
      'total_duration': 3147418,
      'max_duration': 95280,
    },
    'under_500_us': {
      'total_calls': 12,
      'total_duration': 2093818,
      'max_duration': 477605,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1459337,
      'max_duration': 1459337,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingConnectionMessageRead': {
    'under_1_us': {
      'total_calls': 52,
      'total_duration': 47005,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 27628,
      'total_duration': 81368648,
      'max_duration': 9910,
    },
    'under_50_us': {
      'total_calls': 180,
      'total_duration': 3546139,
      'max_duration': 49679,
    },
    'under_100_us': {
      'total_calls': 21,
      'total_duration': 1402126,
      'max_duration': 95771,
    },
    'under_500_us': {
      'total_calls': 16,
      'total_duration': 2436448,
      'max_duration': 351343,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlocksGenesisCheckAppliedGetMetaSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1251,
      'max_duration': 1251,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1089,
      'total_duration': 44563791,
      'max_duration': 49999,
    },
    'under_100_us': {
      'total_calls': 4255,
      'total_duration': 319676375,
      'max_duration': 99980,
    },
    'under_500_us': {
      'total_calls': 10614,
      'total_duration': 2178201760,
      'max_duration': 499768,
    },
    'under_1_ms': {
      'total_calls': 238,
      'total_duration': 154849027,
      'max_duration': 993497,
    },
    'under_5_ms': {
      'total_calls': 488,
      'total_duration': 1421168006,
      'max_duration': 4998512,
    },
    'above_5_ms': {
      'total_calls': 161,
      'total_duration': 1004280603,
      'max_duration': 22400027,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageRequestCreate': {
    'under_1_us': {
      'total_calls': 217299,
      'total_duration': 188018962,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 3122309,
      'total_duration': 6380972775,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 47104,
      'total_duration': 975004182,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11741,
      'total_duration': 845063814,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 17825,
      'total_duration': 3454569351,
      'max_duration': 499669,
    },
    'under_1_ms': {
      'total_calls': 208,
      'total_duration': 130540476,
      'max_duration': 978076,
    },
    'under_5_ms': {
      'total_calls': 47,
      'total_duration': 77342910,
      'max_duration': 4782009,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersGraylistAddress': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 19524,
      'total_duration': 158154792,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 27220,
      'total_duration': 440858351,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 2249,
      'total_duration': 154209071,
      'max_duration': 99989,
    },
    'under_500_us': {
      'total_calls': 565,
      'total_duration': 82752790,
      'max_duration': 475451,
    },
    'under_1_ms': {
      'total_calls': 315,
      'total_duration': 222984851,
      'max_duration': 996010,
    },
    'under_5_ms': {
      'total_calls': 108,
      'total_duration': 179393454,
      'max_duration': 4862681,
    },
    'above_5_ms': {
      'total_calls': 12,
      'total_duration': 111889341,
      'max_duration': 16056231,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockHeaderGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 14940,
      'max_duration': 14940,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 52625,
      'max_duration': 52625,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageWriteNextChunk': {
    'under_1_us': {
      'total_calls': 2780246,
      'total_duration': 2229234444,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 59398536,
      'total_duration': 122050409896,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 214154,
      'total_duration': 4674192433,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 16297,
      'total_duration': 1078544747,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 2468,
      'total_duration': 369158517,
      'max_duration': 499339,
    },
    'under_1_ms': {
      'total_calls': 214,
      'total_duration': 147104894,
      'max_duration': 999328,
    },
    'under_5_ms': {
      'total_calls': 61,
      'total_duration': 102475948,
      'max_duration': 4338475,
    },
    'above_5_ms': {
      'total_calls': 5,
      'total_duration': 47198518,
      'max_duration': 16503175,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsGetCycleEras': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 22349,
      'total_duration': 155209325,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 8420,
      'total_duration': 114908184,
      'max_duration': 49018,
    },
    'under_100_us': {
      'total_calls': 62,
      'total_duration': 4183053,
      'max_duration': 95932,
    },
    'under_500_us': {
      'total_calls': 12,
      'total_duration': 2941389,
      'max_duration': 489569,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 1872483,
      'max_duration': 793366,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerMessageWriteInit': {
    'under_1_us': {
      'total_calls': 132,
      'total_duration': 123089,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 70512768,
      'total_duration': 386464114287,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 20906149,
      'total_duration': 300137779572,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 859966,
      'total_duration': 57834172688,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 170564,
      'total_duration': 23806434745,
      'max_duration': 499939,
    },
    'under_1_ms': {
      'total_calls': 2143,
      'total_duration': 1491167589,
      'max_duration': 999368,
    },
    'under_5_ms': {
      'total_calls': 7521,
      'total_duration': 20342154797,
      'max_duration': 4992043,
    },
    'above_5_ms': {
      'total_calls': 681,
      'total_duration': 4295014062,
      'max_duration': 38584702,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRequestsPotentialPeersGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 3555,
      'total_duration': 23785020,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 508,
      'total_duration': 6680698,
      'max_duration': 49398,
    },
    'under_100_us': {
      'total_calls': 6,
      'total_duration': 382363,
      'max_duration': 92355,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 655070,
      'max_duration': 365040,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersCheckTimeoutsInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1131403,
      'total_duration': 9542811455,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 3192924,
      'total_duration': 46180254559,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11739,
      'total_duration': 774844545,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 1894,
      'total_duration': 287583603,
      'max_duration': 498566,
    },
    'under_1_ms': {
      'total_calls': 251,
      'total_duration': 162320506,
      'max_duration': 991431,
    },
    'under_5_ms': {
      'total_calls': 37,
      'total_duration': 64126323,
      'max_duration': 3708154,
    },
    'above_5_ms': {
      'total_calls': 3,
      'total_duration': 24315443,
      'max_duration': 10682744,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitContext': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 68879,
      'max_duration': 68879,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerStart': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 49038,
      'max_duration': 49038,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockOperationsGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30683,
      'total_duration': 84827532,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 123,
      'total_duration': 3054572,
      'max_duration': 49769,
    },
    'under_100_us': {
      'total_calls': 29,
      'total_duration': 1920248,
      'max_duration': 98376,
    },
    'under_500_us': {
      'total_calls': 7,
      'total_duration': 1018927,
      'max_duration': 187827,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 598747,
      'max_duration': 598747,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitContextIpcServer': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 5842,
      'max_duration': 5842,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 19319,
      'max_duration': 9699,
    },
    'under_50_us': {
      'total_calls': 4956,
      'total_duration': 203028084,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 12157,
      'total_duration': 787309619,
      'max_duration': 99860,
    },
    'under_500_us': {
      'total_calls': 1392,
      'total_duration': 274011322,
      'max_duration': 498707,
    },
    'under_1_ms': {
      'total_calls': 5719,
      'total_duration': 4251019829,
      'max_duration': 999948,
    },
    'under_5_ms': {
      'total_calls': 5296,
      'total_duration': 10468793506,
      'max_duration': 4987471,
    },
    'above_5_ms': {
      'total_calls': 1322,
      'total_duration': 11778649726,
      'max_duration': 21925795,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerResponse': {
    'under_1_us': {
      'total_calls': 61,
      'total_duration': 58924,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 1195142,
      'total_duration': 6291962627,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 180265,
      'total_duration': 2742123354,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11775,
      'total_duration': 842570721,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 27268,
      'total_duration': 6045520099,
      'max_duration': 499970,
    },
    'under_1_ms': {
      'total_calls': 2158,
      'total_duration': 1376532707,
      'max_duration': 999568,
    },
    'under_5_ms': {
      'total_calls': 303,
      'total_duration': 496940476,
      'max_duration': 4972887,
    },
    'above_5_ms': {
      'total_calls': 16,
      'total_duration': 100719501,
      'max_duration': 9310713,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersGraylistIpRemove': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 472,
      'total_duration': 3141921,
      'max_duration': 9979,
    },
    'under_50_us': {
      'total_calls': 13501,
      'total_duration': 564356094,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 10085,
      'total_duration': 619390971,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 421,
      'total_duration': 93615383,
      'max_duration': 499930,
    },
    'under_1_ms': {
      'total_calls': 13282,
      'total_duration': 9100546119,
      'max_duration': 999980,
    },
    'under_5_ms': {
      'total_calls': 9572,
      'total_duration': 21809162988,
      'max_duration': 4997881,
    },
    'above_5_ms': {
      'total_calls': 1487,
      'total_duration': 12516838190,
      'max_duration': 28346793,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerCurrentHeadUpdate': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 3,
      'total_duration': 22087,
      'max_duration': 9761,
    },
    'under_50_us': {
      'total_calls': 49,
      'total_duration': 1668295,
      'max_duration': 49900,
    },
    'under_100_us': {
      'total_calls': 37,
      'total_duration': 2658363,
      'max_duration': 97185,
    },
    'under_500_us': {
      'total_calls': 2159,
      'total_duration': 956123121,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 28130,
      'total_duration': 18389549062,
      'max_duration': 999929,
    },
    'under_5_ms': {
      'total_calls': 465,
      'total_duration': 530061044,
      'max_duration': 4306971,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingMetadataMessageDecode': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 22760,
      'total_duration': 121378426,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1224,
      'total_duration': 31291173,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 528,
      'total_duration': 36327367,
      'max_duration': 99629,
    },
    'under_500_us': {
      'total_calls': 207,
      'total_duration': 34699517,
      'max_duration': 428186,
    },
    'under_1_ms': {
      'total_calls': 10,
      'total_duration': 6399284,
      'max_duration': 793326,
    },
    'under_5_ms': {
      'total_calls': 13,
      'total_duration': 30172084,
      'max_duration': 4559015,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 3958,
      'max_duration': 3958,
    },
    'under_50_us': {
      'total_calls': 33,
      'total_duration': 1516794,
      'max_duration': 49839,
    },
    'under_100_us': {
      'total_calls': 7848,
      'total_duration': 679947979,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 22622,
      'total_duration': 3729279924,
      'max_duration': 499920,
    },
    'under_1_ms': {
      'total_calls': 291,
      'total_duration': 194771741,
      'max_duration': 993726,
    },
    'under_5_ms': {
      'total_calls': 49,
      'total_duration': 65113898,
      'max_duration': 2675518,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockHeaderGetEnqueue': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 17846,
      'total_duration': 72143584,
      'max_duration': 9980,
    },
    'under_50_us': {
      'total_calls': 138,
      'total_duration': 2786120,
      'max_duration': 45381,
    },
    'under_100_us': {
      'total_calls': 5,
      'total_duration': 329389,
      'max_duration': 83096,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 763206,
      'max_duration': 475460,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 15050,
      'max_duration': 7856,
    },
    'under_50_us': {
      'total_calls': 398,
      'total_duration': 16200260,
      'max_duration': 49959,
    },
    'under_100_us': {
      'total_calls': 4356,
      'total_duration': 335522919,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 2539,
      'total_duration': 387415784,
      'max_duration': 499810,
    },
    'under_1_ms': {
      'total_calls': 5512,
      'total_duration': 4133328956,
      'max_duration': 999407,
    },
    'under_5_ms': {
      'total_calls': 3067,
      'total_duration': 6141856498,
      'max_duration': 4995629,
    },
    'above_5_ms': {
      'total_calls': 810,
      'total_duration': 7001903393,
      'max_duration': 19378391,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockHeaderGetFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 15692,
      'total_duration': 96503883,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 451,
      'total_duration': 6933568,
      'max_duration': 49208,
    },
    'under_100_us': {
      'total_calls': 7,
      'total_duration': 455910,
      'max_duration': 85460,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 190090,
      'max_duration': 190090,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapFromPeerCurrentHead': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 4871,
      'total_duration': 220996557,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 12418,
      'total_duration': 812020433,
      'max_duration': 99980,
    },
    'under_500_us': {
      'total_calls': 11010,
      'total_duration': 1649996305,
      'max_duration': 487755,
    },
    'under_1_ms': {
      'total_calls': 1630,
      'total_duration': 1303945898,
      'max_duration': 999339,
    },
    'under_5_ms': {
      'total_calls': 894,
      'total_duration': 1226176683,
      'max_duration': 4297260,
    },
    'above_5_ms': {
      'total_calls': 19,
      'total_duration': 144120875,
      'max_duration': 10941685,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionOutgoingSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 80,
      'total_duration': 502571,
      'max_duration': 9989,
    },
    'under_50_us': {
      'total_calls': 10105,
      'total_duration': 385805572,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 4493,
      'total_duration': 282298181,
      'max_duration': 99891,
    },
    'under_500_us': {
      'total_calls': 676,
      'total_duration': 178759397,
      'max_duration': 497513,
    },
    'under_1_ms': {
      'total_calls': 5485,
      'total_duration': 3928733680,
      'max_duration': 999969,
    },
    'under_5_ms': {
      'total_calls': 5798,
      'total_duration': 12990457355,
      'max_duration': 4997422,
    },
    'above_5_ms': {
      'total_calls': 1258,
      'total_duration': 10427109307,
      'max_duration': 23018508,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetNextBlockInit': {
    'under_1_us': {
      'total_calls': 5561,
      'total_duration': 4641122,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 2988107,
      'total_duration': 7195339871,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 9285,
      'total_duration': 216781684,
      'max_duration': 49980,
    },
    'under_100_us': {
      'total_calls': 1080,
      'total_duration': 71204739,
      'max_duration': 99800,
    },
    'under_500_us': {
      'total_calls': 308,
      'total_duration': 56333987,
      'max_duration': 493967,
    },
    'under_1_ms': {
      'total_calls': 23,
      'total_duration': 15822301,
      'max_duration': 959297,
    },
    'under_5_ms': {
      'total_calls': 4,
      'total_duration': 5874487,
      'max_duration': 1982024,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersAddIncomingPeer': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1884,
      'max_duration': 1884,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 122716,
      'max_duration': 122716,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageReadSizeReady': {
    'under_1_us': {
      'total_calls': 2548034,
      'total_duration': 2196895751,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 151073699,
      'total_duration': 363911626184,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 759316,
      'total_duration': 16137427734,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 66953,
      'total_duration': 4437435999,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 11890,
      'total_duration': 1966005465,
      'max_duration': 499989,
    },
    'under_1_ms': {
      'total_calls': 2292,
      'total_duration': 1557817300,
      'max_duration': 999190,
    },
    'under_5_ms': {
      'total_calls': 360,
      'total_duration': 527463619,
      'max_duration': 4748822,
    },
    'above_5_ms': {
      'total_calls': 17,
      'total_duration': 190824721,
      'max_duration': 29007510,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageCycleErasError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2505,
      'max_duration': 2505,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerTryWriteLoopStart': {
    'under_1_us': {
      'total_calls': 2634787,
      'total_duration': 2205313308,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 143549801,
      'total_duration': 341397609354,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 42758745,
      'total_duration': 1236290870508,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 10278608,
      'total_duration': 662452110156,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 773892,
      'total_duration': 137981689859,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 310989,
      'total_duration': 211336512526,
      'max_duration': 1000000,
    },
    'under_5_ms': {
      'total_calls': 9246,
      'total_duration': 12925961687,
      'max_duration': 4973633,
    },
    'above_5_ms': {
      'total_calls': 121,
      'total_duration': 1121306199,
      'max_duration': 27817949,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockHeaderGetInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 5039,
      'max_duration': 5039,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 11714,
      'max_duration': 11714,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapFinished': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 17024,
      'total_duration': 693447273,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 12781,
      'total_duration': 856420685,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 1019,
      'total_duration': 123965333,
      'max_duration': 436883,
    },
    'under_1_ms': {
      'total_calls': 13,
      'total_duration': 8777639,
      'max_duration': 758296,
    },
    'under_5_ms': {
      'total_calls': 6,
      'total_duration': 6727179,
      'max_duration': 1309899,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageRequestSuccess': {
    'under_1_us': {
      'total_calls': 173758,
      'total_duration': 151586806,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 3176050,
      'total_duration': 6623966865,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 32263,
      'total_duration': 877618215,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 16293,
      'total_duration': 1267959289,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 18088,
      'total_duration': 2621178277,
      'max_duration': 497896,
    },
    'under_1_ms': {
      'total_calls': 66,
      'total_duration': 45200367,
      'max_duration': 987504,
    },
    'under_5_ms': {
      'total_calls': 15,
      'total_duration': 31133160,
      'max_duration': 4261227,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerMessageReadInit': {
    'under_1_us': {
      'total_calls': 2763981,
      'total_duration': 2435899276,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 151066755,
      'total_duration': 359287155054,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 540533,
      'total_duration': 12949673407,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 55106,
      'total_duration': 3698708107,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 9518,
      'total_duration': 1535802691,
      'max_duration': 499929,
    },
    'under_1_ms': {
      'total_calls': 1034,
      'total_duration': 688528995,
      'max_duration': 996042,
    },
    'under_5_ms': {
      'total_calls': 202,
      'total_duration': 362518659,
      'max_duration': 4966493,
    },
    'above_5_ms': {
      'total_calls': 12,
      'total_duration': 164012358,
      'max_duration': 27063131,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageReadInit': {
    'under_1_us': {
      'total_calls': 5266677,
      'total_duration': 4359729286,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 148820050,
      'total_duration': 285364636670,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 351152,
      'total_duration': 8922842657,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 40940,
      'total_duration': 2750512460,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 7156,
      'total_duration': 1149111389,
      'max_duration': 499981,
    },
    'under_1_ms': {
      'total_calls': 743,
      'total_duration': 493097321,
      'max_duration': 999839,
    },
    'under_5_ms': {
      'total_calls': 140,
      'total_duration': 270753875,
      'max_duration': 4793813,
    },
    'above_5_ms': {
      'total_calls': 11,
      'total_duration': 88079345,
      'max_duration': 18886817,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierEnqueueBlock': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30024,
      'total_duration': 98322839,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 753,
      'total_duration': 18816283,
      'max_duration': 49959,
    },
    'under_100_us': {
      'total_calls': 51,
      'total_duration': 3088632,
      'max_duration': 88637,
    },
    'under_500_us': {
      'total_calls': 10,
      'total_duration': 2166453,
      'max_duration': 400209,
    },
    'under_1_ms': {
      'total_calls': 5,
      'total_duration': 3511600,
      'max_duration': 992624,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1347405,
      'max_duration': 1347405,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolSendValidated': {
    'under_1_us': {
      'total_calls': 624880,
      'total_duration': 589686832,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 55705212,
      'total_duration': 135147901831,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 513855,
      'total_duration': 11604925929,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 95882,
      'total_duration': 6681422530,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 42650,
      'total_duration': 6099706824,
      'max_duration': 499730,
    },
    'under_1_ms': {
      'total_calls': 342,
      'total_duration': 238589153,
      'max_duration': 998285,
    },
    'under_5_ms': {
      'total_calls': 746,
      'total_duration': 2063058858,
      'max_duration': 4999777,
    },
    'above_5_ms': {
      'total_calls': 308,
      'total_duration': 1889422248,
      'max_duration': 31232466,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingConnectionMessageWrite': {
    'under_1_us': {
      'total_calls': 17,
      'total_duration': 14609,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 26953,
      'total_duration': 95742510,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 810,
      'total_duration': 15132817,
      'max_duration': 49219,
    },
    'under_100_us': {
      'total_calls': 82,
      'total_duration': 5533816,
      'max_duration': 98998,
    },
    'under_500_us': {
      'total_calls': 35,
      'total_duration': 6114331,
      'max_duration': 350020,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersMainBranchFindSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 7085,
      'max_duration': 7085,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 34799,
      'max_duration': 34799,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionIncomingAcceptSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 7464,
      'max_duration': 6322,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerDisconnect': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 13,
      'total_duration': 101843,
      'max_duration': 9930,
    },
    'under_50_us': {
      'total_calls': 18297,
      'total_duration': 755939658,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 50383,
      'total_duration': 3567655884,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 23339,
      'total_duration': 3621457552,
      'max_duration': 499900,
    },
    'under_1_ms': {
      'total_calls': 2394,
      'total_duration': 1876522985,
      'max_duration': 999851,
    },
    'under_5_ms': {
      'total_calls': 1861,
      'total_duration': 3128645090,
      'max_duration': 4958405,
    },
    'above_5_ms': {
      'total_calls': 137,
      'total_duration': 987168660,
      'max_duration': 23490832,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MioWaitForEvents': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 12693028,
      'total_duration': 66781842667,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 595622,
      'total_duration': 17897415077,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 1854046,
      'total_duration': 145214297153,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 16316073,
      'total_duration': 4801120677900,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 15847102,
      'total_duration': 11672571304299,
      'max_duration': 1000000,
    },
    'under_5_ms': {
      'total_calls': 57003020,
      'total_duration': 145728307396517,
      'max_duration': 5000000,
    },
    'above_5_ms': {
      'total_calls': 32993976,
      'total_duration': 725762658947890,
      'max_duration': 222686776,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolUnregisterOperationsStreams': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30749,
      'total_duration': 73683808,
      'max_duration': 9969,
    },
    'under_50_us': {
      'total_calls': 90,
      'total_duration': 1716886,
      'max_duration': 43216,
    },
    'under_100_us': {
      'total_calls': 5,
      'total_duration': 321561,
      'max_duration': 76252,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageCycleErasGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2364,
      'max_duration': 2364,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockOperationsGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 27638,
      'total_duration': 862894040,
      'max_duration': 49991,
    },
    'under_100_us': {
      'total_calls': 2010,
      'total_duration': 133031696,
      'max_duration': 99941,
    },
    'under_500_us': {
      'total_calls': 1110,
      'total_duration': 208697055,
      'max_duration': 498778,
    },
    'under_1_ms': {
      'total_calls': 70,
      'total_duration': 41714765,
      'max_duration': 992364,
    },
    'under_5_ms': {
      'total_calls': 10,
      'total_duration': 25400954,
      'max_duration': 4974223,
    },
    'above_5_ms': {
      'total_calls': 6,
      'total_duration': 41904529,
      'max_duration': 8440445,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersMainBranchFindInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 29479,
      'max_duration': 29479,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MioTimeoutEvent': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 219,
      'total_duration': 1591673,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 723664,
      'total_duration': 20737569623,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 453130,
      'total_duration': 28798609823,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 2025,
      'total_duration': 263121562,
      'max_duration': 475671,
    },
    'under_1_ms': {
      'total_calls': 35,
      'total_duration': 25023638,
      'max_duration': 997845,
    },
    'under_5_ms': {
      'total_calls': 24,
      'total_duration': 46953484,
      'max_duration': 4208013,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 9208352,
      'max_duration': 9208352,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockOperationsReceived': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 61713,
      'total_duration': 356559138,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 28272,
      'total_duration': 543290906,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 7884,
      'total_duration': 587008141,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 26249,
      'total_duration': 6015839552,
      'max_duration': 499990,
    },
    'under_1_ms': {
      'total_calls': 849,
      'total_duration': 498087654,
      'max_duration': 995540,
    },
    'under_5_ms': {
      'total_calls': 36,
      'total_duration': 60937875,
      'max_duration': 4804787,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 24755230,
      'max_duration': 24755230,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2300674,
      'total_duration': 15647239519,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 10885986,
      'total_duration': 158065298535,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 48562,
      'total_duration': 3187521727,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 7596,
      'total_duration': 1205168574,
      'max_duration': 499378,
    },
    'under_1_ms': {
      'total_calls': 625,
      'total_duration': 406821177,
      'max_duration': 999798,
    },
    'under_5_ms': {
      'total_calls': 87,
      'total_duration': 144343357,
      'max_duration': 4453535,
    },
    'above_5_ms': {
      'total_calls': 5,
      'total_duration': 43062038,
      'max_duration': 15940577,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolBroadcastDone': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 40900308,
      'total_duration': 276726136697,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 17412159,
      'total_duration': 240831423134,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 173037,
      'total_duration': 11204652272,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 25989,
      'total_duration': 4533721651,
      'max_duration': 499900,
    },
    'under_1_ms': {
      'total_calls': 3683,
      'total_duration': 2553658308,
      'max_duration': 999709,
    },
    'under_5_ms': {
      'total_calls': 3464,
      'total_duration': 8209279483,
      'max_duration': 4990188,
    },
    'above_5_ms': {
      'total_calls': 115,
      'total_duration': 770244825,
      'max_duration': 22084480,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsCycleErasKVError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 94499,
      'max_duration': 94499,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorValidateSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 105984,
      'total_duration': 891473662,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 849149,
      'total_duration': 22584894286,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 121280,
      'total_duration': 7876757891,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 261337,
      'total_duration': 74299479948,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 8600,
      'total_duration': 5144007480,
      'max_duration': 999479,
    },
    'under_5_ms': {
      'total_calls': 658,
      'total_duration': 944550159,
      'max_duration': 4841995,
    },
    'above_5_ms': {
      'total_calls': 5,
      'total_duration': 55990058,
      'max_duration': 19285374,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2405,
      'max_duration': 2405,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitContextIpcServerSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1823,
      'max_duration': 1823,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'CurrentHeadRehydrateInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 3587,
      'max_duration': 3587,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageReadChunkReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 15,
      'total_duration': 412340,
      'max_duration': 46493,
    },
    'under_100_us': {
      'total_calls': 11,
      'total_duration': 831171,
      'max_duration': 94308,
    },
    'under_500_us': {
      'total_calls': 62,
      'total_duration': 17169815,
      'max_duration': 498477,
    },
    'under_1_ms': {
      'total_calls': 14,
      'total_duration': 10105020,
      'max_duration': 995731,
    },
    'under_5_ms': {
      'total_calls': 5,
      'total_duration': 6594581,
      'max_duration': 2059536,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockOperationsGetNextAll': {
    'under_1_us': {
      'total_calls': 30,
      'total_duration': 28079,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 30471,
      'total_duration': 71981893,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 211,
      'total_duration': 5278126,
      'max_duration': 49860,
    },
    'under_100_us': {
      'total_calls': 121,
      'total_duration': 7712513,
      'max_duration': 96974,
    },
    'under_500_us': {
      'total_calls': 10,
      'total_duration': 1417878,
      'max_duration': 178457,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerDisconnected': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 3245,
      'total_duration': 19075089,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 79310,
      'total_duration': 2034757036,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 9355,
      'total_duration': 654112694,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 4461,
      'total_duration': 605735131,
      'max_duration': 492575,
    },
    'under_1_ms': {
      'total_calls': 41,
      'total_duration': 25013468,
      'max_duration': 863627,
    },
    'under_5_ms': {
      'total_calls': 12,
      'total_duration': 19718590,
      'max_duration': 3422612,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsCycleErasGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 4179,
      'max_duration': 4179,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2784,
      'total_duration': 23716009,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 15908,
      'total_duration': 323276737,
      'max_duration': 49980,
    },
    'under_100_us': {
      'total_calls': 5438,
      'total_duration': 375986575,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 1328,
      'total_duration': 206381565,
      'max_duration': 498948,
    },
    'under_1_ms': {
      'total_calls': 1290,
      'total_duration': 958565398,
      'max_duration': 999627,
    },
    'under_5_ms': {
      'total_calls': 1062,
      'total_duration': 1940511545,
      'max_duration': 4967571,
    },
    'above_5_ms': {
      'total_calls': 87,
      'total_duration': 610201574,
      'max_duration': 14771881,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsCycleErasError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 62636,
      'max_duration': 62636,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsProtocolHashReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 22568,
      'total_duration': 144008117,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 8167,
      'total_duration': 129795831,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 98,
      'total_duration': 6126347,
      'max_duration': 97977,
    },
    'under_500_us': {
      'total_calls': 13,
      'total_duration': 1931676,
      'max_duration': 347004,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 2907144,
      'max_duration': 2907144,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 64749,
      'max_duration': 64749,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'P2pServerEvent': {
    'under_1_us': {
      'total_calls': 1136,
      'total_duration': 981947,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 51637,
      'total_duration': 271668812,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 69800,
      'total_duration': 1338437397,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 2275,
      'total_duration': 148284399,
      'max_duration': 99969,
    },
    'under_500_us': {
      'total_calls': 240,
      'total_duration': 33867792,
      'max_duration': 379137,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 1792454,
      'max_duration': 717755,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 2120000,
      'max_duration': 1076604,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRequestsPotentialPeersGetFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2334,
      'total_duration': 18908764,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1666,
      'total_duration': 20889304,
      'max_duration': 45641,
    },
    'under_100_us': {
      'total_calls': 3,
      'total_duration': 221713,
      'max_duration': 88217,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 163537,
      'max_duration': 163537,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetNextBlockPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2993287,
      'total_duration': 8500215442,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 9507,
      'total_duration': 221921884,
      'max_duration': 49999,
    },
    'under_100_us': {
      'total_calls': 1022,
      'total_duration': 69862823,
      'max_duration': 99759,
    },
    'under_500_us': {
      'total_calls': 510,
      'total_duration': 101822844,
      'max_duration': 491504,
    },
    'under_1_ms': {
      'total_calls': 37,
      'total_duration': 23087892,
      'max_duration': 921283,
    },
    'under_5_ms': {
      'total_calls': 5,
      'total_duration': 7699779,
      'max_duration': 2842523,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsGetBlockHeader': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30779,
      'total_duration': 90270629,
      'max_duration': 9970,
    },
    'under_50_us': {
      'total_calls': 66,
      'total_duration': 1448374,
      'max_duration': 47014,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 50652,
      'max_duration': 50652,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsPruneRpcRequest': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 9649,
      'max_duration': 9649,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRequestsPotentialPeersGetError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 25,
      'total_duration': 225754,
      'max_duration': 9941,
    },
    'under_50_us': {
      'total_calls': 40,
      'total_duration': 1079835,
      'max_duration': 48617,
    },
    'under_100_us': {
      'total_calls': 3,
      'total_duration': 170633,
      'max_duration': 61394,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionIncomingAccept': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 2,
      'total_duration': 15933,
      'max_duration': 9320,
    },
    'under_50_us': {
      'total_calls': 26044,
      'total_duration': 1071598803,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 87917,
      'total_duration': 5933296530,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 11115,
      'total_duration': 1400614713,
      'max_duration': 496643,
    },
    'under_1_ms': {
      'total_calls': 12,
      'total_duration': 8056867,
      'max_duration': 816792,
    },
    'under_5_ms': {
      'total_calls': 5,
      'total_duration': 9968501,
      'max_duration': 2570869,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetNextBlockSuccess': {
    'under_1_us': {
      'total_calls': 2376,
      'total_duration': 2118503,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 2959459,
      'total_duration': 10120161355,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 38675,
      'total_duration': 742177943,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 3211,
      'total_duration': 209895506,
      'max_duration': 99950,
    },
    'under_500_us': {
      'total_calls': 595,
      'total_duration': 102770662,
      'max_duration': 497064,
    },
    'under_1_ms': {
      'total_calls': 26,
      'total_duration': 17841072,
      'max_duration': 977284,
    },
    'under_5_ms': {
      'total_calls': 11,
      'total_duration': 20580608,
      'max_duration': 3857731,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 6028615,
      'max_duration': 6028615,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerMessageWriteNext': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 60749160,
      'total_duration': 312870848229,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1548646,
      'total_duration': 25656046238,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 55068,
      'total_duration': 3657601208,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 8126,
      'total_duration': 1174284711,
      'max_duration': 499609,
    },
    'under_1_ms': {
      'total_calls': 486,
      'total_duration': 330832420,
      'max_duration': 999078,
    },
    'under_5_ms': {
      'total_calls': 171,
      'total_duration': 317435298,
      'max_duration': 4763003,
    },
    'above_5_ms': {
      'total_calls': 16,
      'total_duration': 154711304,
      'max_duration': 19564359,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerValidateOperation': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 12951674,
      'total_duration': 45387185675,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 244226,
      'total_duration': 4541234688,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 14396,
      'total_duration': 963408248,
      'max_duration': 99970,
    },
    'under_500_us': {
      'total_calls': 2119,
      'total_duration': 351767350,
      'max_duration': 499820,
    },
    'under_1_ms': {
      'total_calls': 244,
      'total_duration': 161182611,
      'max_duration': 996964,
    },
    'under_5_ms': {
      'total_calls': 30,
      'total_duration': 45259775,
      'max_duration': 4102493,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 16855576,
      'max_duration': 10946432,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingAckMessageWrite': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 24482,
      'total_duration': 85518133,
      'max_duration': 9989,
    },
    'under_50_us': {
      'total_calls': 232,
      'total_duration': 4917516,
      'max_duration': 47595,
    },
    'under_100_us': {
      'total_calls': 22,
      'total_duration': 1479575,
      'max_duration': 92475,
    },
    'under_500_us': {
      'total_calls': 4,
      'total_duration': 848076,
      'max_duration': 361824,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1692914,
      'max_duration': 901482,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockHeadersGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 29148,
      'total_duration': 123625137,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1093,
      'total_duration': 20515745,
      'max_duration': 49749,
    },
    'under_100_us': {
      'total_calls': 524,
      'total_duration': 36788403,
      'max_duration': 99909,
    },
    'under_500_us': {
      'total_calls': 77,
      'total_duration': 10612896,
      'max_duration': 474869,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 647966,
      'max_duration': 647966,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2616,
      'max_duration': 2616,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockOperationsGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 66109,
      'total_duration': 439707541,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 10484,
      'total_duration': 174945183,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 3940,
      'total_duration': 309232562,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 5120,
      'total_duration': 775580735,
      'max_duration': 497755,
    },
    'under_1_ms': {
      'total_calls': 54,
      'total_duration': 34830348,
      'max_duration': 985951,
    },
    'under_5_ms': {
      'total_calls': 17,
      'total_duration': 23150079,
      'max_duration': 2087925,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingEncryptionInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1438,
      'total_duration': 11925735,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 23106,
      'total_duration': 381309594,
      'max_duration': 49979,
    },
    'under_100_us': {
      'total_calls': 349,
      'total_duration': 22557160,
      'max_duration': 99319,
    },
    'under_500_us': {
      'total_calls': 72,
      'total_duration': 11841802,
      'max_duration': 464619,
    },
    'under_1_ms': {
      'total_calls': 17,
      'total_duration': 11595686,
      'max_duration': 853306,
    },
    'under_5_ms': {
      'total_calls': 3,
      'total_duration': 9623389,
      'max_duration': 3398623,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 5133211,
      'max_duration': 5133211,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PausedLoopsResumeNextInit': {
    'under_1_us': {
      'total_calls': 1420,
      'total_duration': 1150390,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 14579,
      'total_duration': 24880240,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 154,
      'total_duration': 3964411,
      'max_duration': 49909,
    },
    'under_100_us': {
      'total_calls': 54,
      'total_duration': 3658444,
      'max_duration': 97405,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 391191,
      'max_duration': 148837,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingAckMessageRead': {
    'under_1_us': {
      'total_calls': 2,
      'total_duration': 1912,
      'max_duration': 971,
    },
    'under_10_us': {
      'total_calls': 24475,
      'total_duration': 87820736,
      'max_duration': 9971,
    },
    'under_50_us': {
      'total_calls': 227,
      'total_duration': 5258809,
      'max_duration': 47696,
    },
    'under_100_us': {
      'total_calls': 27,
      'total_duration': 1839348,
      'max_duration': 93207,
    },
    'under_500_us': {
      'total_calls': 8,
      'total_duration': 1152847,
      'max_duration': 342646,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 1904165,
      'max_duration': 744458,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeersCheckTimeoutsCleanup': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 4321861,
      'total_duration': 14329985469,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 14493,
      'total_duration': 356452063,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 1527,
      'total_duration': 102277122,
      'max_duration': 99970,
    },
    'under_500_us': {
      'total_calls': 291,
      'total_duration': 48662630,
      'max_duration': 499479,
    },
    'under_1_ms': {
      'total_calls': 69,
      'total_duration': 45620873,
      'max_duration': 971182,
    },
    'under_5_ms': {
      'total_calls': 10,
      'total_duration': 16757061,
      'max_duration': 3512113,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkReadReady': {
    'under_1_us': {
      'total_calls': 9293023,
      'total_duration': 7399220193,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 144836128,
      'total_duration': 238248738206,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 327247,
      'total_duration': 7095917774,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 25655,
      'total_duration': 1685912004,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 4239,
      'total_duration': 735454806,
      'max_duration': 499598,
    },
    'under_1_ms': {
      'total_calls': 1191,
      'total_duration': 794114687,
      'max_duration': 991913,
    },
    'under_5_ms': {
      'total_calls': 162,
      'total_duration': 256756231,
      'max_duration': 4396449,
    },
    'above_5_ms': {
      'total_calls': 9,
      'total_duration': 79335631,
      'max_duration': 18666799,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingConnectionMessageDecode': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 3303,
      'total_duration': 277482431,
      'max_duration': 99970,
    },
    'under_500_us': {
      'total_calls': 21556,
      'total_duration': 3132957295,
      'max_duration': 497565,
    },
    'under_1_ms': {
      'total_calls': 87,
      'total_duration': 60246553,
      'max_duration': 993927,
    },
    'under_5_ms': {
      'total_calls': 39,
      'total_duration': 58541626,
      'max_duration': 4647762,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 7387124,
      'max_duration': 7387124,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolBroadcast': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 10342,
      'total_duration': 87699374,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 20291,
      'total_duration': 364458757,
      'max_duration': 49869,
    },
    'under_100_us': {
      'total_calls': 181,
      'total_duration': 11218298,
      'max_duration': 96693,
    },
    'under_500_us': {
      'total_calls': 24,
      'total_duration': 3942445,
      'max_duration': 399138,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 2483093,
      'max_duration': 760541,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 5539373,
      'max_duration': 4443042,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolOperationValidateNext': {
    'under_1_us': {
      'total_calls': 124,
      'total_duration': 116434,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 1494911,
      'total_duration': 6153510589,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 632350,
      'total_duration': 9232568979,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 6196,
      'total_duration': 415518831,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 1825,
      'total_duration': 307894924,
      'max_duration': 498647,
    },
    'under_1_ms': {
      'total_calls': 191,
      'total_duration': 127994921,
      'max_duration': 989819,
    },
    'under_5_ms': {
      'total_calls': 40,
      'total_duration': 73961427,
      'max_duration': 4221069,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerCurrentHeadUpdate': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 148337,
      'total_duration': 5171973638,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 515098,
      'total_duration': 39300106186,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 254299,
      'total_duration': 46823736653,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 362560,
      'total_duration': 269405590201,
      'max_duration': 999999,
    },
    'under_5_ms': {
      'total_calls': 275559,
      'total_duration': 575868706506,
      'max_duration': 4999996,
    },
    'above_5_ms': {
      'total_calls': 67201,
      'total_duration': 572978475343,
      'max_duration': 35294201,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerCategorizeOperation': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 13136614,
      'total_duration': 52568751270,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 65592,
      'total_duration': 1597624840,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 8520,
      'total_duration': 563245317,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 1695,
      'total_duration': 298290005,
      'max_duration': 497775,
    },
    'under_1_ms': {
      'total_calls': 229,
      'total_duration': 150734604,
      'max_duration': 976261,
    },
    'under_5_ms': {
      'total_calls': 39,
      'total_duration': 59636364,
      'max_duration': 3830949,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 34436627,
      'max_duration': 22748718,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerRevalidateOperation': {
    'under_1_us': {
      'total_calls': 426164,
      'total_duration': 386726525,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 190106,
      'total_duration': 366068638,
      'max_duration': 9999,
    },
    'under_50_us': {
      'total_calls': 555,
      'total_duration': 9464372,
      'max_duration': 47245,
    },
    'under_100_us': {
      'total_calls': 7,
      'total_duration': 445482,
      'max_duration': 89860,
    },
    'under_500_us': {
      'total_calls': 5,
      'total_duration': 694848,
      'max_duration': 181512,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolGetOperationTimeout': {
    'under_1_us': {
      'total_calls': 8,
      'total_duration': 7777,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 51747,
      'total_duration': 266151401,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 378,
      'total_duration': 8723773,
      'max_duration': 49699,
    },
    'under_100_us': {
      'total_calls': 28,
      'total_duration': 1843525,
      'max_duration': 94569,
    },
    'under_500_us': {
      'total_calls': 4,
      'total_duration': 1085402,
      'max_duration': 468617,
    },
    'under_1_ms': {
      'total_calls': 6,
      'total_duration': 4830569,
      'max_duration': 954107,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 2167263,
      'max_duration': 1109768,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StatsCurrentHeadSent': {
    'under_1_us': {
      'total_calls': 175,
      'total_duration': 172198,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 1612529,
      'total_duration': 3288513034,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 6228,
      'total_duration': 102671933,
      'max_duration': 49629,
    },
    'under_100_us': {
      'total_calls': 172,
      'total_duration': 11319572,
      'max_duration': 99059,
    },
    'under_500_us': {
      'total_calls': 50,
      'total_duration': 7256627,
      'max_duration': 389629,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1273818,
      'max_duration': 1273818,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsBlockHeaderReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 16248,
      'total_duration': 116282731,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 14542,
      'total_duration': 253475868,
      'max_duration': 49961,
    },
    'under_100_us': {
      'total_calls': 216,
      'total_duration': 13876600,
      'max_duration': 97496,
    },
    'under_500_us': {
      'total_calls': 32,
      'total_duration': 5068150,
      'max_duration': 370982,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 7,
      'total_duration': 21547830,
      'max_duration': 3730598,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsGetProtocolHash': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 29157,
      'total_duration': 130352778,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1635,
      'total_duration': 24150284,
      'max_duration': 49960,
    },
    'under_100_us': {
      'total_calls': 22,
      'total_duration': 1517307,
      'max_duration': 96614,
    },
    'under_500_us': {
      'total_calls': 23,
      'total_duration': 3927392,
      'max_duration': 436764,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 8,
      'total_duration': 24183984,
      'max_duration': 3975578,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 5925244,
      'max_duration': 5925244,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'CurrentHeadRehydrated': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 43267,
      'max_duration': 43267,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingConnectionMessageInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 14826,
      'total_duration': 108923710,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 12704,
      'total_duration': 190405973,
      'max_duration': 49900,
    },
    'under_100_us': {
      'total_calls': 235,
      'total_duration': 16135920,
      'max_duration': 99881,
    },
    'under_500_us': {
      'total_calls': 116,
      'total_duration': 20699368,
      'max_duration': 474700,
    },
    'under_1_ms': {
      'total_calls': 7,
      'total_duration': 4449380,
      'max_duration': 800012,
    },
    'under_5_ms': {
      'total_calls': 7,
      'total_duration': 21304443,
      'max_duration': 4755096,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 11509999,
      'max_duration': 6485123,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapCheckTimeoutsInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 35415,
      'total_duration': 166234969,
      'max_duration': 9980,
    },
    'under_50_us': {
      'total_calls': 181,
      'total_duration': 4811883,
      'max_duration': 48928,
    },
    'under_100_us': {
      'total_calls': 27,
      'total_duration': 1966056,
      'max_duration': 98316,
    },
    'under_500_us': {
      'total_calls': 16,
      'total_duration': 3032500,
      'max_duration': 385480,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1253486,
      'max_duration': 748696,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkReadDecrypt': {
    'under_1_us': {
      'total_calls': 3121829,
      'total_duration': 2695216747,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 150304121,
      'total_duration': 342216093635,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 914280,
      'total_duration': 18610971229,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 93001,
      'total_duration': 6278613083,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 26678,
      'total_duration': 4466148656,
      'max_duration': 499929,
    },
    'under_1_ms': {
      'total_calls': 2365,
      'total_duration': 1604061754,
      'max_duration': 999608,
    },
    'under_5_ms': {
      'total_calls': 376,
      'total_duration': 560722005,
      'max_duration': 4783706,
    },
    'above_5_ms': {
      'total_calls': 18,
      'total_duration': 187206720,
      'max_duration': 20928830,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30765,
      'total_duration': 103032121,
      'max_duration': 9990,
    },
    'under_50_us': {
      'total_calls': 70,
      'total_duration': 1358030,
      'max_duration': 41703,
    },
    'under_100_us': {
      'total_calls': 2,
      'total_duration': 121203,
      'max_duration': 61273,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 821070,
      'max_duration': 462474,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 956523,
      'max_duration': 956523,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 5533913,
      'max_duration': 3739256,
    },
    'above_5_ms': {
      'total_calls': 3,
      'total_duration': 55802654,
      'max_duration': 30427883,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockOperationsGetRetry': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1140,
      'total_duration': 9349094,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 2159,
      'total_duration': 43083111,
      'max_duration': 49329,
    },
    'under_100_us': {
      'total_calls': 77,
      'total_duration': 4892228,
      'max_duration': 99849,
    },
    'under_500_us': {
      'total_calls': 15,
      'total_duration': 2710347,
      'max_duration': 357967,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitRuntimeSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1342,
      'max_duration': 1342,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PausedLoopsResumeNextSuccess': {
    'under_1_us': {
      'total_calls': 1,
      'total_duration': 983,
      'max_duration': 983,
    },
    'under_10_us': {
      'total_calls': 16143,
      'total_duration': 62333503,
      'max_duration': 9889,
    },
    'under_50_us': {
      'total_calls': 55,
      'total_duration': 1442254,
      'max_duration': 43186,
    },
    'under_100_us': {
      'total_calls': 9,
      'total_duration': 536102,
      'max_duration': 85712,
    },
    'under_500_us': {
      'total_calls': 2,
      'total_duration': 310980,
      'max_duration': 197043,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 4831,
      'total_duration': 41631252,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 11855,
      'total_duration': 154467017,
      'max_duration': 49669,
    },
    'under_100_us': {
      'total_calls': 140,
      'total_duration': 9412951,
      'max_duration': 96603,
    },
    'under_500_us': {
      'total_calls': 24,
      'total_duration': 4677001,
      'max_duration': 495911,
    },
    'under_1_ms': {
      'total_calls': 5,
      'total_duration': 3446608,
      'max_duration': 932313,
    },
    'under_5_ms': {
      'total_calls': 4,
      'total_duration': 7364902,
      'max_duration': 3396859,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingMetadataMessageEncode': {
    'under_1_us': {
      'total_calls': 1,
      'total_duration': 991,
      'max_duration': 991,
    },
    'under_10_us': {
      'total_calls': 24784,
      'total_duration': 91530282,
      'max_duration': 9980,
    },
    'under_50_us': {
      'total_calls': 171,
      'total_duration': 4023935,
      'max_duration': 49821,
    },
    'under_100_us': {
      'total_calls': 24,
      'total_duration': 1644017,
      'max_duration': 99308,
    },
    'under_500_us': {
      'total_calls': 5,
      'total_duration': 924697,
      'max_duration': 263996,
    },
    'under_1_ms': {
      'total_calls': 1,
      'total_duration': 508457,
      'max_duration': 508457,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyProtocolRunnerApplySuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 1234,
      'total_duration': 112428833,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 28455,
      'total_duration': 6251018589,
      'max_duration': 499970,
    },
    'under_1_ms': {
      'total_calls': 1132,
      'total_duration': 655655620,
      'max_duration': 998877,
    },
    'under_5_ms': {
      'total_calls': 22,
      'total_duration': 31457653,
      'max_duration': 4025007,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 5295737,
      'max_duration': 5295737,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockOperationsGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 12592,
      'total_duration': 107119516,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 18041,
      'total_duration': 292032339,
      'max_duration': 49729,
    },
    'under_100_us': {
      'total_calls': 172,
      'total_duration': 10769033,
      'max_duration': 96623,
    },
    'under_500_us': {
      'total_calls': 25,
      'total_duration': 5842489,
      'max_duration': 499067,
    },
    'under_1_ms': {
      'total_calls': 10,
      'total_duration': 5786377,
      'max_duration': 750930,
    },
    'under_5_ms': {
      'total_calls': 3,
      'total_duration': 4283166,
      'max_duration': 1513297,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolRecvDone': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 328822,
      'total_duration': 2446685101,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 60526833,
      'total_duration': 1822470216299,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 34298863,
      'total_duration': 2449390646841,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 22115120,
      'total_duration': 3471767034322,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 224464,
      'total_duration': 146977275430,
      'max_duration': 999999,
    },
    'under_5_ms': {
      'total_calls': 59039,
      'total_duration': 105361034757,
      'max_duration': 4999254,
    },
    'above_5_ms': {
      'total_calls': 661,
      'total_duration': 4926772343,
      'max_duration': 26947979,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsCurrentBranchGetFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 83,
      'total_duration': 748799,
      'max_duration': 9971,
    },
    'under_50_us': {
      'total_calls': 14115,
      'total_duration': 399080702,
      'max_duration': 49999,
    },
    'under_100_us': {
      'total_calls': 1238,
      'total_duration': 85863904,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 1375,
      'total_duration': 224990304,
      'max_duration': 487085,
    },
    'under_1_ms': {
      'total_calls': 32,
      'total_duration': 23055273,
      'max_duration': 979979,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 2425219,
      'max_duration': 1332193,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyProtocolRunnerApplyInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 19,
      'total_duration': 880908,
      'max_duration': 49709,
    },
    'under_100_us': {
      'total_calls': 2010,
      'total_duration': 170294880,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 25577,
      'total_duration': 5977176926,
      'max_duration': 499950,
    },
    'under_1_ms': {
      'total_calls': 2352,
      'total_duration': 1515338176,
      'max_duration': 998786,
    },
    'under_5_ms': {
      'total_calls': 805,
      'total_duration': 1826994328,
      'max_duration': 4844736,
    },
    'above_5_ms': {
      'total_calls': 81,
      'total_duration': 881929906,
      'max_duration': 25961998,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolGetOperations': {
    'under_1_us': {
      'total_calls': 86,
      'total_duration': 82665,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 10953774,
      'total_duration': 36435761356,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 155441,
      'total_duration': 4236525609,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 87927,
      'total_duration': 6153874346,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 20997,
      'total_duration': 2718658106,
      'max_duration': 494309,
    },
    'under_1_ms': {
      'total_calls': 128,
      'total_duration': 84884785,
      'max_duration': 986572,
    },
    'under_5_ms': {
      'total_calls': 398,
      'total_duration': 1109929778,
      'max_duration': 4986629,
    },
    'above_5_ms': {
      'total_calls': 27,
      'total_duration': 167801983,
      'max_duration': 10479245,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkReadInit': {
    'under_1_us': {
      'total_calls': 147,
      'total_duration': 125312,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 53255208,
      'total_duration': 346970757570,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 100610890,
      'total_duration': 1396912172399,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 542421,
      'total_duration': 35742110483,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 97454,
      'total_duration': 15545609615,
      'max_duration': 499969,
    },
    'under_1_ms': {
      'total_calls': 7141,
      'total_duration': 4794097695,
      'max_duration': 999968,
    },
    'under_5_ms': {
      'total_calls': 1548,
      'total_duration': 2632481331,
      'max_duration': 4971101,
    },
    'above_5_ms': {
      'total_calls': 64,
      'total_duration': 621764188,
      'max_duration': 23633199,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlockAdditionalDataOk': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 18,
      'total_duration': 163936,
      'max_duration': 9910,
    },
    'under_50_us': {
      'total_calls': 1170,
      'total_duration': 37206473,
      'max_duration': 49959,
    },
    'under_100_us': {
      'total_calls': 1522,
      'total_duration': 115513304,
      'max_duration': 99979,
    },
    'under_500_us': {
      'total_calls': 9045,
      'total_duration': 2497454495,
      'max_duration': 499999,
    },
    'under_1_ms': {
      'total_calls': 6640,
      'total_duration': 4909830029,
      'max_duration': 999899,
    },
    'under_5_ms': {
      'total_calls': 12337,
      'total_duration': 24272788626,
      'max_duration': 4998303,
    },
    'above_5_ms': {
      'total_calls': 114,
      'total_duration': 650964511,
      'max_duration': 8369149,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWriteEncryptContent': {
    'under_1_us': {
      'total_calls': 2259062,
      'total_duration': 1992898010,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 59558356,
      'total_duration': 135984973943,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 540057,
      'total_duration': 11595304453,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 42526,
      'total_duration': 2851515150,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 11557,
      'total_duration': 1825933384,
      'max_duration': 499930,
    },
    'under_1_ms': {
      'total_calls': 369,
      'total_duration': 250548116,
      'max_duration': 996643,
    },
    'under_5_ms': {
      'total_calls': 127,
      'total_duration': 200625946,
      'max_duration': 4960077,
    },
    'above_5_ms': {
      'total_calls': 7,
      'total_duration': 55842304,
      'max_duration': 17627259,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerTryWriteLoopFinish': {
    'under_1_us': {
      'total_calls': 720512,
      'total_duration': 691236165,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 166033780,
      'total_duration': 737910495472,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 33225412,
      'total_duration': 503518925577,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 288751,
      'total_duration': 18972717421,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 44216,
      'total_duration': 6851604639,
      'max_duration': 499980,
    },
    'under_1_ms': {
      'total_calls': 2637,
      'total_duration': 1768407116,
      'max_duration': 998657,
    },
    'under_5_ms': {
      'total_calls': 817,
      'total_duration': 1395316826,
      'max_duration': 4941620,
    },
    'above_5_ms': {
      'total_calls': 49,
      'total_duration': 440085705,
      'max_duration': 22065115,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 25637,
      'total_duration': 632914602,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 1809,
      'total_duration': 160331348,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 3395,
      'total_duration': 398543016,
      'max_duration': 476682,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1430529,
      'max_duration': 787504,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1167221,
      'max_duration': 1167221,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlockHeaderOk': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 57,
      'total_duration': 390876,
      'max_duration': 9909,
    },
    'under_50_us': {
      'total_calls': 370,
      'total_duration': 10710552,
      'max_duration': 49890,
    },
    'under_100_us': {
      'total_calls': 455,
      'total_duration': 33021755,
      'max_duration': 99969,
    },
    'under_500_us': {
      'total_calls': 3875,
      'total_duration': 1180502099,
      'max_duration': 499808,
    },
    'under_1_ms': {
      'total_calls': 6664,
      'total_duration': 5112370176,
      'max_duration': 999980,
    },
    'under_5_ms': {
      'total_calls': 37023,
      'total_duration': 86577068271,
      'max_duration': 4999324,
    },
    'above_5_ms': {
      'total_calls': 394,
      'total_duration': 2211403249,
      'max_duration': 11891965,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerBinaryMessageReadReady': {
    'under_1_us': {
      'total_calls': 78,
      'total_duration': 73130,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 55712620,
      'total_duration': 314782598885,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 97572857,
      'total_duration': 1471818305964,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 857712,
      'total_duration': 57969764572,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 302069,
      'total_duration': 48649548911,
      'max_duration': 499980,
    },
    'under_1_ms': {
      'total_calls': 13510,
      'total_duration': 9124158048,
      'max_duration': 999881,
    },
    'under_5_ms': {
      'total_calls': 3296,
      'total_duration': 6462072493,
      'max_duration': 4999097,
    },
    'above_5_ms': {
      'total_calls': 419,
      'total_duration': 2904816688,
      'max_duration': 30728946,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageRequestPending': {
    'under_1_us': {
      'total_calls': 64,
      'total_duration': 62699,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 3274782,
      'total_duration': 11289972470,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 117699,
      'total_duration': 2624982286,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 18885,
      'total_duration': 1239070212,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 4931,
      'total_duration': 745719221,
      'max_duration': 498166,
    },
    'under_1_ms': {
      'total_calls': 148,
      'total_duration': 99458001,
      'max_duration': 996412,
    },
    'under_5_ms': {
      'total_calls': 22,
      'total_duration': 37161663,
      'max_duration': 3459015,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 28019154,
      'max_duration': 22057262,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionOutgoingError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 5403,
      'total_duration': 48008092,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 25894,
      'total_duration': 530172593,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 11944,
      'total_duration': 823622024,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 1944,
      'total_duration': 263825435,
      'max_duration': 497085,
    },
    'under_1_ms': {
      'total_calls': 2034,
      'total_duration': 1509974855,
      'max_duration': 999519,
    },
    'under_5_ms': {
      'total_calls': 864,
      'total_duration': 1200371412,
      'max_duration': 4597200,
    },
    'above_5_ms': {
      'total_calls': 17,
      'total_duration': 130313313,
      'max_duration': 10090777,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWriteSetContent': {
    'under_1_us': {
      'total_calls': 21,
      'total_duration': 17303,
      'max_duration': 992,
    },
    'under_10_us': {
      'total_calls': 60900188,
      'total_duration': 297120080497,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1393398,
      'total_duration': 26242092324,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 106456,
      'total_duration': 7095082530,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 36833,
      'total_duration': 6462688453,
      'max_duration': 499859,
    },
    'under_1_ms': {
      'total_calls': 2735,
      'total_duration': 1730745961,
      'max_duration': 999680,
    },
    'under_5_ms': {
      'total_calls': 318,
      'total_duration': 492873471,
      'max_duration': 4920268,
    },
    'above_5_ms': {
      'total_calls': 9,
      'total_duration': 85986667,
      'max_duration': 17433243,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockHeaderGetInitNext': {
    'under_1_us': {
      'total_calls': 7,
      'total_duration': 6205,
      'max_duration': 973,
    },
    'under_10_us': {
      'total_calls': 17911,
      'total_duration': 64593306,
      'max_duration': 9819,
    },
    'under_50_us': {
      'total_calls': 71,
      'total_duration': 1700858,
      'max_duration': 46905,
    },
    'under_100_us': {
      'total_calls': 3,
      'total_duration': 171051,
      'max_duration': 63357,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockOperationsGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 364,
      'total_duration': 16037139,
      'max_duration': 49970,
    },
    'under_100_us': {
      'total_calls': 9753,
      'total_duration': 790873884,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 20553,
      'total_duration': 3301381785,
      'max_duration': 497745,
    },
    'under_1_ms': {
      'total_calls': 155,
      'total_duration': 99531894,
      'max_duration': 995690,
    },
    'under_5_ms': {
      'total_calls': 17,
      'total_duration': 30069266,
      'max_duration': 4439167,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 14381711,
      'max_duration': 7874864,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsCycleErasContextRequested': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 5641,
      'max_duration': 5641,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 180,
      'total_duration': 1600764,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 870,
      'total_duration': 17722977,
      'max_duration': 49971,
    },
    'under_100_us': {
      'total_calls': 383,
      'total_duration': 26324457,
      'max_duration': 99760,
    },
    'under_500_us': {
      'total_calls': 81,
      'total_duration': 10645160,
      'max_duration': 439719,
    },
    'under_1_ms': {
      'total_calls': 68,
      'total_duration': 49827366,
      'max_duration': 988657,
    },
    'under_5_ms': {
      'total_calls': 35,
      'total_duration': 44029474,
      'max_duration': 3155457,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PausedLoopsResumeAll': {
    'under_1_us': {
      'total_calls': 578,
      'total_duration': 472121,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 15081,
      'total_duration': 36070863,
      'max_duration': 9992,
    },
    'under_50_us': {
      'total_calls': 350,
      'total_duration': 6895254,
      'max_duration': 49770,
    },
    'under_100_us': {
      'total_calls': 88,
      'total_duration': 5696188,
      'max_duration': 99930,
    },
    'under_500_us': {
      'total_calls': 6,
      'total_duration': 726495,
      'max_duration': 156484,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 8765563,
      'max_duration': 8765563,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitContextSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 18267,
      'max_duration': 18267,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'P2pPeerEvent': {
    'under_1_us': {
      'total_calls': 1165349,
      'total_duration': 924762792,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 99534288,
      'total_duration': 518083254458,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 36987824,
      'total_duration': 541895494784,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 195282,
      'total_duration': 12780572711,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 42000,
      'total_duration': 6874345808,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 1956,
      'total_duration': 1295042909,
      'max_duration': 999458,
    },
    'under_5_ms': {
      'total_calls': 709,
      'total_duration': 1341927252,
      'max_duration': 4895962,
    },
    'above_5_ms': {
      'total_calls': 46,
      'total_duration': 424219125,
      'max_duration': 21159638,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingAckMessageDecode': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 16174,
      'total_duration': 88548406,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 678,
      'total_duration': 10992247,
      'max_duration': 49699,
    },
    'under_100_us': {
      'total_calls': 41,
      'total_duration': 2860652,
      'max_duration': 94158,
    },
    'under_500_us': {
      'total_calls': 27,
      'total_duration': 4455456,
      'max_duration': 382905,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 1863635,
      'max_duration': 656351,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1854395,
      'max_duration': 1854395,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockHeaderGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 17510,
      'total_duration': 109192777,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 471,
      'total_duration': 7980556,
      'max_duration': 49129,
    },
    'under_100_us': {
      'total_calls': 8,
      'total_duration': 467115,
      'max_duration': 65731,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 670660,
      'max_duration': 443386,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingAckMessageInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 22585,
      'total_duration': 111428140,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 1955,
      'total_duration': 34765205,
      'max_duration': 49969,
    },
    'under_100_us': {
      'total_calls': 173,
      'total_duration': 11330751,
      'max_duration': 98737,
    },
    'under_500_us': {
      'total_calls': 25,
      'total_duration': 4886643,
      'max_duration': 448968,
    },
    'under_1_ms': {
      'total_calls': 2,
      'total_duration': 1239036,
      'max_duration': 624548,
    },
    'under_5_ms': {
      'total_calls': 2,
      'total_duration': 2093186,
      'max_duration': 1060020,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyStoreApplyResultPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 4297,
      'total_duration': 190365419,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 19850,
      'total_duration': 1326133361,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 5778,
      'total_duration': 1223005462,
      'max_duration': 499629,
    },
    'under_1_ms': {
      'total_calls': 729,
      'total_duration': 491592456,
      'max_duration': 998197,
    },
    'under_5_ms': {
      'total_calls': 188,
      'total_duration': 288278042,
      'max_duration': 3539726,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 24450836,
      'max_duration': 15491405,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PrecheckerCacheProtocol': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 15490,
      'max_duration': 15490,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerMessageWriteSuccess': {
    'under_1_us': {
      'total_calls': 957780,
      'total_duration': 862931361,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 61094829,
      'total_duration': 161829599056,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 284405,
      'total_duration': 6226366819,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 21269,
      'total_duration': 1406486044,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 3074,
      'total_duration': 452398903,
      'max_duration': 499940,
    },
    'under_1_ms': {
      'total_calls': 236,
      'total_duration': 160986086,
      'max_duration': 994658,
    },
    'under_5_ms': {
      'total_calls': 76,
      'total_duration': 130009076,
      'max_duration': 4965997,
    },
    'above_5_ms': {
      'total_calls': 4,
      'total_duration': 37938376,
      'max_duration': 12685419,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'CurrentHeadRehydrateSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2975,
      'max_duration': 2975,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockHeaderGetSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 17187,
      'total_duration': 93273401,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 702,
      'total_duration': 12009576,
      'max_duration': 49388,
    },
    'under_100_us': {
      'total_calls': 65,
      'total_duration': 4519741,
      'max_duration': 98307,
    },
    'under_500_us': {
      'total_calls': 16,
      'total_duration': 1998269,
      'max_duration': 234348,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapScheduleBlockForApply': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 10759,
      'total_duration': 458751356,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 18522,
      'total_duration': 1180519234,
      'max_duration': 99999,
    },
    'under_500_us': {
      'total_calls': 1458,
      'total_duration': 201727393,
      'max_duration': 498216,
    },
    'under_1_ms': {
      'total_calls': 86,
      'total_duration': 58243312,
      'max_duration': 981582,
    },
    'under_5_ms': {
      'total_calls': 18,
      'total_duration': 24363622,
      'max_duration': 2292864,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 12760902,
      'max_duration': 12760902,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyStoreApplyResultSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30496,
      'total_duration': 139528544,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 300,
      'total_duration': 5084149,
      'max_duration': 48047,
    },
    'under_100_us': {
      'total_calls': 38,
      'total_duration': 2605688,
      'max_duration': 94930,
    },
    'under_500_us': {
      'total_calls': 10,
      'total_duration': 1958082,
      'max_duration': 488237,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkWriteError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 3,
      'total_duration': 130120,
      'max_duration': 49318,
    },
    'under_100_us': {
      'total_calls': 1,
      'total_duration': 59038,
      'max_duration': 59038,
    },
    'under_500_us': {
      'total_calls': 1,
      'total_duration': 493878,
      'max_duration': 493878,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 2052694,
      'max_duration': 863947,
    },
    'under_5_ms': {
      'total_calls': 6,
      'total_duration': 13209095,
      'max_duration': 3639536,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 7174739,
      'max_duration': 7174739,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StatsCurrentHeadPrepareSend': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1479837,
      'total_duration': 6868621407,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 110155,
      'total_duration': 1859524297,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 10153,
      'total_duration': 782171557,
      'max_duration': 99990,
    },
    'under_500_us': {
      'total_calls': 13218,
      'total_duration': 2757428492,
      'max_duration': 499959,
    },
    'under_1_ms': {
      'total_calls': 1087,
      'total_duration': 681613546,
      'max_duration': 999829,
    },
    'under_5_ms': {
      'total_calls': 4652,
      'total_duration': 13030963194,
      'max_duration': 4994084,
    },
    'above_5_ms': {
      'total_calls': 54,
      'total_duration': 304372652,
      'max_duration': 8745793,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'CurrentHeadUpdate': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 909068,
      'max_duration': 457434,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 3096579,
      'max_duration': 865399,
    },
    'under_5_ms': {
      'total_calls': 73,
      'total_duration': 212206015,
      'max_duration': 4871387,
    },
    'above_5_ms': {
      'total_calls': 30764,
      'total_duration': 7451955116496,
      'max_duration': 820989663,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsProtocolConstantsReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 29639,
      'total_duration': 125468571,
      'max_duration': 9992,
    },
    'under_50_us': {
      'total_calls': 1199,
      'total_duration': 17386396,
      'max_duration': 49999,
    },
    'under_100_us': {
      'total_calls': 5,
      'total_duration': 295621,
      'max_duration': 69729,
    },
    'under_500_us': {
      'total_calls': 3,
      'total_duration': 354810,
      'max_duration': 127435,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionOutgoingPending': {
    'under_1_us': {
      'total_calls': 9,
      'total_duration': 8338,
      'max_duration': 972,
    },
    'under_10_us': {
      'total_calls': 86506,
      'total_duration': 362173977,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 9286,
      'total_duration': 231963714,
      'max_duration': 49990,
    },
    'under_100_us': {
      'total_calls': 589,
      'total_duration': 37575233,
      'max_duration': 99728,
    },
    'under_500_us': {
      'total_calls': 71,
      'total_duration': 10771101,
      'max_duration': 407966,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 2132332,
      'max_duration': 956823,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerRemoteRequestsBlockOperationsGetFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30123,
      'total_duration': 166875961,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 9846,
      'total_duration': 159971205,
      'max_duration': 49980,
    },
    'under_100_us': {
      'total_calls': 4182,
      'total_duration': 332200770,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 5523,
      'total_duration': 820190020,
      'max_duration': 496102,
    },
    'under_1_ms': {
      'total_calls': 90,
      'total_duration': 59747386,
      'max_duration': 995851,
    },
    'under_5_ms': {
      'total_calls': 24,
      'total_duration': 30059578,
      'max_duration': 1748356,
    },
    'above_5_ms': {
      'total_calls': 1,
      'total_duration': 5085385,
      'max_duration': 5085385,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'CurrentHeadRehydratePending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 3959,
      'max_duration': 3959,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolRpcRespond': {
    'under_1_us': {
      'total_calls': 3761,
      'total_duration': 3557809,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 751338,
      'total_duration': 2932992765,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 587336,
      'total_duration': 8138840989,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 4156,
      'total_duration': 267936842,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 399,
      'total_duration': 58675495,
      'max_duration': 495591,
    },
    'under_1_ms': {
      'total_calls': 14,
      'total_duration': 9179771,
      'max_duration': 993607,
    },
    'under_5_ms': {
      'total_calls': 5,
      'total_duration': 8899152,
      'max_duration': 3479799,
    },
    'above_5_ms': {
      'total_calls': 4,
      'total_duration': 62917093,
      'max_duration': 22348085,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolTimeoutsInit': {
    'under_1_us': {
      'total_calls': 830288,
      'total_duration': 782144422,
      'max_duration': 994,
    },
    'under_10_us': {
      'total_calls': 136040086,
      'total_duration': 322512459236,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 377364,
      'total_duration': 9532320455,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 45579,
      'total_duration': 3054921797,
      'max_duration': 99991,
    },
    'under_500_us': {
      'total_calls': 8239,
      'total_duration': 1338846342,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 1100,
      'total_duration': 726012067,
      'max_duration': 997835,
    },
    'under_5_ms': {
      'total_calls': 195,
      'total_duration': 377980024,
      'max_duration': 4483806,
    },
    'above_5_ms': {
      'total_calls': 16,
      'total_duration': 163159147,
      'max_duration': 15693191,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeerBlockOperationsGetTimeout': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 28,
      'total_duration': 1172642,
      'max_duration': 49989,
    },
    'under_100_us': {
      'total_calls': 754,
      'total_duration': 62141195,
      'max_duration': 99979,
    },
    'under_500_us': {
      'total_calls': 1118,
      'total_duration': 153675445,
      'max_duration': 497715,
    },
    'under_1_ms': {
      'total_calls': 811,
      'total_duration': 631326220,
      'max_duration': 998546,
    },
    'under_5_ms': {
      'total_calls': 635,
      'total_duration': 1285539688,
      'max_duration': 4870379,
    },
    'above_5_ms': {
      'total_calls': 44,
      'total_duration': 338079086,
      'max_duration': 14775238,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerConnectionIncomingSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 2,
      'total_duration': 51913,
      'max_duration': 41072,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsRpcGet': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 7135,
      'max_duration': 7135,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolValidatorReady': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 865,
      'total_duration': 7049475,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 24561,
      'total_duration': 643857608,
      'max_duration': 49989,
    },
    'under_100_us': {
      'total_calls': 2808,
      'total_duration': 178290828,
      'max_duration': 99919,
    },
    'under_500_us': {
      'total_calls': 2019,
      'total_duration': 497596272,
      'max_duration': 499470,
    },
    'under_1_ms': {
      'total_calls': 435,
      'total_duration': 298900124,
      'max_duration': 985730,
    },
    'under_5_ms': {
      'total_calls': 152,
      'total_duration': 257578178,
      'max_duration': 4870548,
    },
    'above_5_ms': {
      'total_calls': 4,
      'total_duration': 25303975,
      'max_duration': 7690644,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'RightsCycleErasContextError': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 48006,
      'max_duration': 48006,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitCheckGenesisAppliedSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1152,
      'max_duration': 1152,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapPeersBlockHeadersGetPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 41314,
      'max_duration': 41314,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapScheduleBlocksForApply': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 30676,
      'total_duration': 95822401,
      'max_duration': 9799,
    },
    'under_50_us': {
      'total_calls': 149,
      'total_duration': 3343183,
      'max_duration': 49479,
    },
    'under_100_us': {
      'total_calls': 5,
      'total_duration': 368867,
      'max_duration': 88176,
    },
    'under_500_us': {
      'total_calls': 9,
      'total_duration': 1937192,
      'max_duration': 491672,
    },
    'under_1_ms': {
      'total_calls': 4,
      'total_duration': 2831289,
      'max_duration': 954288,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 1683505,
      'max_duration': 1683505,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerSpawnServerInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 1,
      'total_duration': 2219807,
      'max_duration': 2219807,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerHandshakingConnectionMessageEncode': {
    'under_1_us': {
      'total_calls': 13,
      'total_duration': 11755,
      'max_duration': 972,
    },
    'under_10_us': {
      'total_calls': 26981,
      'total_duration': 118886643,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 788,
      'total_duration': 13555795,
      'max_duration': 49318,
    },
    'under_100_us': {
      'total_calls': 76,
      'total_duration': 5279987,
      'max_duration': 99680,
    },
    'under_500_us': {
      'total_calls': 36,
      'total_duration': 6879966,
      'max_duration': 494549,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 1674047,
      'max_duration': 566963,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BootstrapInit': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 2685,
      'max_duration': 2685,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageRequestFinish': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 3185688,
      'total_duration': 12893659280,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 196899,
      'total_duration': 3748320954,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 26929,
      'total_duration': 1856721898,
      'max_duration': 99970,
    },
    'under_500_us': {
      'total_calls': 6769,
      'total_duration': 1163880484,
      'max_duration': 498878,
    },
    'under_1_ms': {
      'total_calls': 203,
      'total_duration': 135474043,
      'max_duration': 997604,
    },
    'under_5_ms': {
      'total_calls': 43,
      'total_duration': 71170469,
      'max_duration': 3710919,
    },
    'above_5_ms': {
      'total_calls': 2,
      'total_duration': 52823896,
      'max_duration': 40258715,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitContextPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 4098,
      'max_duration': 4098,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'PeerChunkReadPart': {
    'under_1_us': {
      'total_calls': 43,
      'total_duration': 41294,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 216440877,
      'total_duration': 1491326615661,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 78532428,
      'total_duration': 1756351934392,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 13889492,
      'total_duration': 852949407993,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 908955,
      'total_duration': 252402581287,
      'max_duration': 500000,
    },
    'under_1_ms': {
      'total_calls': 1431971,
      'total_duration': 980998191927,
      'max_duration': 999990,
    },
    'under_5_ms': {
      'total_calls': 17150,
      'total_duration': 22776717392,
      'max_duration': 4997003,
    },
    'above_5_ms': {
      'total_calls': 221,
      'total_duration': 2112449595,
      'max_duration': 22304709,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyPrepareDataSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 29905,
      'total_duration': 141348028,
      'max_duration': 9990,
    },
    'under_50_us': {
      'total_calls': 713,
      'total_duration': 19384414,
      'max_duration': 49979,
    },
    'under_100_us': {
      'total_calls': 200,
      'total_duration': 12797129,
      'max_duration': 99599,
    },
    'under_500_us': {
      'total_calls': 23,
      'total_duration': 4051576,
      'max_duration': 468117,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 2176721,
      'max_duration': 902724,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'MempoolGetPendingOperations': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 6,
      'total_duration': 284820,
      'max_duration': 49750,
    },
    'under_100_us': {
      'total_calls': 146,
      'total_duration': 9916979,
      'max_duration': 98216,
    },
    'under_500_us': {
      'total_calls': 31,
      'total_duration': 5267818,
      'max_duration': 487475,
    },
    'under_1_ms': {
      'total_calls': 3,
      'total_duration': 2597291,
      'max_duration': 926211,
    },
    'under_5_ms': {
      'total_calls': 3220,
      'total_duration': 12111568341,
      'max_duration': 4999072,
    },
    'above_5_ms': {
      'total_calls': 9261,
      'total_duration': 100252665101,
      'max_duration': 82490051,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'BlockApplierApplyProtocolRunnerApplyPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 20501,
      'total_duration': 146032995,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 9828,
      'total_duration': 159275804,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 454,
      'total_duration': 26918889,
      'max_duration': 99570,
    },
    'under_500_us': {
      'total_calls': 45,
      'total_duration': 8266130,
      'max_duration': 443787,
    },
    'under_1_ms': {
      'total_calls': 9,
      'total_duration': 5687982,
      'max_duration': 966142,
    },
    'under_5_ms': {
      'total_calls': 7,
      'total_duration': 14249335,
      'max_duration': 3412492,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'WakeupEvent': {
    'under_1_us': {
      'total_calls': 61,
      'total_duration': 58826,
      'max_duration': 993,
    },
    'under_10_us': {
      'total_calls': 3240421,
      'total_duration': 14889213021,
      'max_duration': 10000,
    },
    'under_50_us': {
      'total_calls': 997347,
      'total_duration': 17843866416,
      'max_duration': 50000,
    },
    'under_100_us': {
      'total_calls': 12700,
      'total_duration': 802212196,
      'max_duration': 100000,
    },
    'under_500_us': {
      'total_calls': 2699,
      'total_duration': 506143183,
      'max_duration': 497826,
    },
    'under_1_ms': {
      'total_calls': 274,
      'total_duration': 182539608,
      'max_duration': 996663,
    },
    'under_5_ms': {
      'total_calls': 104,
      'total_duration': 195512727,
      'max_duration': 4957323,
    },
    'above_5_ms': {
      'total_calls': 340,
      'total_duration': 66469396720,
      'max_duration': 2547316611,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageConstantsOk': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 96,
      'total_duration': 914017,
      'max_duration': 9989,
    },
    'under_50_us': {
      'total_calls': 3168,
      'total_duration': 92625241,
      'max_duration': 49899,
    },
    'under_100_us': {
      'total_calls': 3786,
      'total_duration': 274954245,
      'max_duration': 99970,
    },
    'under_500_us': {
      'total_calls': 23356,
      'total_duration': 5617577747,
      'max_duration': 499989,
    },
    'under_1_ms': {
      'total_calls': 425,
      'total_duration': 250108933,
      'max_duration': 996894,
    },
    'under_5_ms': {
      'total_calls': 15,
      'total_duration': 25709469,
      'max_duration': 2971330,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerSpawnServerPending': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 1,
      'total_duration': 23357,
      'max_duration': 23357,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerInitCheckGenesisApplied': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 1985,
      'max_duration': 1985,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'ProtocolRunnerSpawnServerSuccess': {
    'under_1_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_10_us': {
      'total_calls': 1,
      'total_duration': 3175,
      'max_duration': 3175,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
  'StorageBlocksGenesisCheckAppliedSuccess': {
    'under_1_us': {
      'total_calls': 1,
      'total_duration': 742,
      'max_duration': 742,
    },
    'under_10_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_50_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_100_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_500_us': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_1_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'under_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_5_ms': {
      'total_calls': 0,
      'total_duration': 0,
      'max_duration': 0,
    },
    'above_50_ms': {
      'total_calls': 10,
      'total_duration': 497597000,
      'max_duration': 49759700,
    },
  },
};
