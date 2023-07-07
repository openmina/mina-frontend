import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { toReadableDate } from '@shared/helpers/date.helper';
import { lastItem } from '@shared/helpers/array.helper';
import { DswDashboardBlock, DswDashboardNodeBlockStatus } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';
import { ONE_BILLION, ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';

@Injectable({
  providedIn: 'root',
})
export class DswDashboardService {

  constructor(private http: HttpClient) { }

  getNodes(): Observable<DswDashboardNode[]> {
    return of(JSON.parse(JSON.stringify(mock2()))).pipe(delay(250))
      .pipe(
        map((response: any[]) => {
          return response.map((node: any, i) => {
            return {
              name: 'Node ' + ++i,
              status: node.status,
              bestTipReceived: toReadableDate(node.best_tip_received / ONE_MILLION),
              bestTipReceivedTimestamp: node.best_tip_received / ONE_MILLION,
              bestTip: lastItem(node.blocks).hash,
              fork: '', //todo: fix
              blocksApplied: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.APPLIED).length,
              applyingBlocks: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.APPLYING).length,
              missingBlocks: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.MISSING).length,
              downloadingBlocks: node.blocks.filter((block: any) => block.status !== DswDashboardNodeBlockStatus.FETCHING && block.status !== DswDashboardNodeBlockStatus.MISSING).length,
              details: mockDetail(), //todo: fix
              blocks: node.blocks.map((block: any) => {
                return {
                  globalSlot: block.global_slot,
                  height: block.height,
                  hash: block.hash,
                  predHash: block.pred_hash,
                  status: block.status,
                  fetchStart: block.fetch_start,
                  fetchEnd: block.fetch_end,
                  applyStart: block.apply_start,
                  applyEnd: block.apply_end,
                } as DswDashboardBlock;
              }),
            } as DswDashboardNode;
          });
        }),
      );
  }
}

const mock2 = () => [
  {
    // "status": "Bootstrap" | "Catchup" | "Synced",
    'status': 'Bootstrap',
    'best_tip_received': Date.now() * ONE_MILLION,
    'blocks': [
      {
        'global_slot': 316,
        'height': 142,
        'hash': '3NKrmbYnfDxjyFaHsK2Y7ux5RbMpDyop8Afej9cKgTw4KeGe48Ue',
        'pred_hash': '3NLyY9SAnYG4LKhLe26ufHa2iRcG2R2kRo1YBfrmXpq8bPQnZQRp',
        // "status": "Applied" | "Applying" | "Fetched" | "Fetching" | "Missing",
        'status': 'Applied',
        // below fields might not be set.
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 317,
        'height': 143,
        'hash': '3NLyY9SAnYG4LKhLe26ufHa2iRcG2R2kRo1YBfrmXpq8bPQnZQRp',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Applying',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 318,
        'height': 144,
        'hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Fetching',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 319,
        'height': 145,
        'hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Fetched',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 320,
        'height': 146,
        'hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Missing',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
    ],
  },
  {
    'status': 'Catchup',
    'best_tip_received': 1686818212777045000,
    'blocks': [
      {
        'global_slot': 316,
        'height': 142,
        'hash': '3NKrmbYnfDxjyFaHsK2Y7ux5RbMpDyop8Afej9cKgTw4KeGe48Ue',
        'pred_hash': '3NLyY9SAnYG4LKhLe26ufHa2iRcG2R2kRo1YBfrmXpq8bPQnZQRp',
        'status': 'Applied',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 317,
        'height': 143,
        'hash': '3NLyY9SAnYG4LKhLe26ufHa2iRcG2R2kRo1YBfrmXpq8bPQnZQRp',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Applying',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
      {
        'global_slot': 318,
        'height': 144,
        'hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'pred_hash': '3NQ1fefrdtgbdygrnhythyrthntdy',
        'status': 'Fetching',
        'fetch_start': 1686818212777045000,
        'fetch_end': 1686818212777045000,
        'apply_start': 1686818212777045000,
        'apply_end': 1686818212777045000,
      },
    ],
  },
];

export const mockDetail = () => ({
  syncStakingLedger: '20/06/2023 19:43',
  syncEpochLedger: '20/06/2023 19:43',
  syncRootLedger: '20/06/2023 19:43',
  bestTipReceived: Math.floor(Math.random() * 100),
  missingBlocks: Math.floor(Math.random() * 100),
  downloadingBlocks: Math.floor(Math.random() * 100),
  applyingBlocks: Math.floor(Math.random() * 100),
  appliedBlocks: Math.floor(Math.random() * 100),
});
