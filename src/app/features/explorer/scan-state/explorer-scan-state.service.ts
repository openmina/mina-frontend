import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { GraphQLService } from '@core/services/graph-ql.service';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerScanStateService {

  constructor(private graphQL: GraphQLService) { }

  getScanState(height: number): Observable<{ scanState: ExplorerScanStateTree[], txCount: number, snarksCount: number, firstBlock: number }> {
    return this.graphQL.query<any>('getScanState', `{
       blockScanState(height: ${height})
       block(height: ${height}) {
          snarkJobs
        }
       bestChain(maxLength: 0) {
          protocolState {
            consensusState {
              blockHeight
            }
          }
        }
      }`)
      .pipe(map((response: any) => {
        const scanState = response.blockScanState.scan_state.map((leafs: any) => ({
          leafs: leafs.map((leaf: any[]) => [leaf[0], leaf[1], (leaf[2] && Array.isArray(leaf[2])) ? leaf[2] : [leaf[2]], leaf[3], leaf[4]]),
          done: leafs.filter((l: any[]) => l[4] === 'Done').length,
          todo: leafs.filter((l: any[]) => l[4] === 'Todo').length,
          empty: leafs.filter((l: any[]) => !l[4]).length,
        } as ExplorerScanStateTree));
        const txCount = response.blockScanState.transactions.length;
        const snarksCount = response.block.snarkJobs.length;
        const firstBlock = Number(response.bestChain[0].protocolState.consensusState.blockHeight);
        return { scanState, txCount, snarksCount, firstBlock };
      }));
  }
}
