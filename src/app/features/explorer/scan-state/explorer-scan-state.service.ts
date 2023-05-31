import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GraphQLService } from '@core/services/graph-ql.service';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { ExplorerScanStateResponse } from '@shared/types/explorer/scan-state/explorer-scan-state-response.type';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExplorerScanStateService {

  constructor(private graphQL: GraphQLService,
              private http: HttpClient) { }

  getScanState(height: number): Observable<ExplorerScanStateResponse> {
    // return this.http.get<ExplorerScanStateResponse>('./assets/ss.json')
    return this.graphQL.query<any>('getScanState', `{
       blockScanState(height: ${height})
       block(height: ${height}) {
         snarkJobs
         transactions {
           userCommands { nonce }
           feeTransfer { fee }
           zkappCommands { id }
         }
       }
       bestChain(maxLength: 1) {
         protocolState {
           consensusState { blockHeight }
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
        const userCommandsCount = response.block.transactions.userCommands.length;
        const feeTransferCount = response.block.transactions.feeTransfer.length;
        const zkappCommandsCount = response.block.transactions.zkappCommands.length;
        return { scanState, txCount, snarksCount, firstBlock, userCommandsCount, feeTransferCount, zkappCommandsCount };
      }));
  }
}
