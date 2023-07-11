import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DswDashboardNode } from '@shared/types/dsw/dashboard/dsw-dashboard-node.type';
import { toReadableDate } from '@shared/helpers/date.helper';
import { lastItem } from '@shared/helpers/array.helper';
import { DswDashboardBlock, DswDashboardNodeBlockStatus } from '@shared/types/dsw/dashboard/dsw-dashboard-block.type';
import { ONE_MILLION } from '@shared/constants/unit-measurements';
import { DswDashboardLedger, DswDashboardLedgerStep, DswDashboardLedgerStepState } from '@shared/types/dsw/dashboard/dsw-dashboard-ledger.type';

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
              fork: '', //todo: remove if not needed
              details: mockDetail(), //todo: remove if not needed
              blocksApplied: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.APPLIED).length,
              applyingBlocks: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.APPLYING).length,
              missingBlocks: node.blocks.filter((block: any) => block.status === DswDashboardNodeBlockStatus.MISSING).length,
              downloadingBlocks: node.blocks.filter((block: any) => block.status !== DswDashboardNodeBlockStatus.FETCHING && block.status !== DswDashboardNodeBlockStatus.MISSING).length,
              ledgers: this.getLedgers(node.ledgers),
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

  private getLedgers(ledgers: any): DswDashboardLedger {
    const ledger = {} as DswDashboardLedger;
    const getLedgerStep = (step: any): DswDashboardLedgerStep => {
      const result = {
        state: this.hasAllStepsCompleted(step) ? DswDashboardLedgerStepState.SUCCESS : this.noneOfStepsCompleted(step) ? DswDashboardLedgerStepState.PENDING : DswDashboardLedgerStepState.LOADING,
        snarked: {
          fetchHashesStart: step.snarked.fetch_hashes_start,
          fetchHashesEnd: step.snarked.fetch_hashes_end,
          fetchAccountsStart: step.snarked.fetch_accounts_start,
          fetchAccountsEnd: step.snarked.fetch_accounts_end,
          fetchHashesDuration: this.getDuration(step.snarked.fetch_hashes_start, step.snarked.fetch_hashes_end),
          fetchAccountsDuration: this.getDuration(step.snarked.fetch_accounts_start, step.snarked.fetch_accounts_end),
        },
        staged: {
          fetchPartsStart: step.staged.fetch_parts_start,
          fetchPartsEnd: step.staged.fetch_parts_end,
          reconstructStart: step.staged.reconstruct_start,
          reconstructEnd: step.staged.reconstruct_end,
          fetchPartsDuration: this.getDuration(step.staged.fetch_parts_start, step.staged.fetch_parts_end),
          reconstructDuration: this.getDuration(step.staged.reconstruct_start, step.staged.reconstruct_end),
        },
      } as DswDashboardLedgerStep;
      result.totalTime = result.snarked.fetchHashesDuration + result.snarked.fetchAccountsDuration + result.staged.fetchPartsDuration + result.staged.reconstructDuration;
      return result;
    };
    if (ledgers.staking_epoch) {
      ledger.stakingEpoch = getLedgerStep(ledgers.staking_epoch);
    }
    if (ledgers.next_epoch) {
      ledger.nextEpoch = getLedgerStep(ledgers.next_epoch);
    }
    if (ledgers.root) {
      ledger.root = getLedgerStep(ledgers.root);
    }
    return ledger;
  }

  private getDuration(start: number, end: number): number | null {
    return (end && start) ? (end - start) / ONE_MILLION : null;
  }

  private hasAllStepsCompleted(step: any): boolean {
    return !!(step.snarked.fetch_hashes_end && step.snarked.fetch_accounts_end && step.staged.fetch_parts_end && step.staged.reconstruct_end);
  }

  private noneOfStepsCompleted(step: any): boolean {
    return !step.snarked.fetch_hashes_start && !step.snarked.fetch_accounts_start && !step.staged.fetch_parts_start && !step.staged.reconstruct_start;
  }
}

const mock2 = () => [
  {
    // "status": "Bootstrap" | "Catchup" | "Synced",
    'status': 'Bootstrap',
    'best_tip_received': Date.now() * ONE_MILLION,
    "ledgers": {
      "root": {
        "snarked": {
          "fetch_hashes_start": null,
          "fetch_hashes_end": null,
          "fetch_accounts_start": null,
          "fetch_accounts_end": null
        },
        "staged": {
          "fetch_parts_start": undefined,
          "fetch_parts_end": null,
          "reconstruct_start": null,
          "reconstruct_end": null
        }
      },
      "staking_epoch": {
        "snarked": {
          "fetch_hashes_start": 1686818212777045000,
          "fetch_hashes_end": 1686818212777045300,
          "fetch_accounts_start": null,
          "fetch_accounts_end": null
        },
        "staged": {
          "fetch_parts_start": 1686818212777045000,
          "fetch_parts_end": 1686818212777045300,
          "reconstruct_start": 1686818212777045000,
          "reconstruct_end": 1686818212777045100
        }
      },
      "next_epoch": {
        "snarked": {
          "fetch_hashes_start": 1686818212777045000,
          "fetch_hashes_end": 1686818212777045300,
          "fetch_accounts_start": 1686818212777045000,
          "fetch_accounts_end": 1686818212777045100
        },
        "staged": {
          "fetch_parts_start": 1686818212777045000,
          "fetch_parts_end": 1686818212777045100,
          "reconstruct_start": 1686818212777045000,
          "reconstruct_end": 1686818212777045200
        }
      }
    },
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
    'ledgers': {},
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
] as any;

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
