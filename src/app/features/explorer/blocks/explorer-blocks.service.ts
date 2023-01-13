import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';
import { GraphQLService } from '@core/services/graph-ql.service';
import { toReadableDate } from '@shared/helpers/date.helper';

@Injectable({
  providedIn: 'root',
})
export class ExplorerBlocksService {

  constructor(private graphQL: GraphQLService) { }

  getBlocks(): Observable<ExplorerBlock[]> {
    return this.graphQL.query('getBlocks', `{
        bestChain {
          protocolState {
            blockchainState {
              snarkedLedgerHash
              stagedLedgerHash
              date
            }
            consensusState {
              blockHeight
            }
          }
          transactions {
            userCommands {
              id
            }
          }
          stateHash
          snarkJobs
        }
      }`)
      .pipe(
        map((response: any) => response.bestChain.map((chain: any) => ({
          height: Number(chain.protocolState.consensusState.blockHeight),
          hash: chain.stateHash,
          txCount: chain.transactions.userCommands.length,
          snarkCount: chain.snarkJobs.length,
          date: toReadableDate(chain.protocolState.blockchainState.date),
          timestamp: chain.protocolState.blockchainState.date,
          snarkedLedgerHash: chain.protocolState.blockchainState.snarkedLedgerHash,
          stagedLedgerHash: chain.protocolState.blockchainState.stagedLedgerHash,
        } as ExplorerBlock))),
      );
  }
}
