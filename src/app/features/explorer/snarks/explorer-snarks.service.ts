import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GraphQLService } from '@core/services/graph-ql.service';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

@Injectable({
  providedIn: 'root',
})
export class ExplorerSnarksService {

  constructor(private graphQL: GraphQLService) { }

  getSnarks(): Observable<ExplorerSnark[]> {
    return this.graphQL.query('snarkPool',`{
        snarkPool {
          workIds
          prover
          fee
        }
      }`)
      .pipe(
        map((data: any) => data.snarkPool
          .map((sn: any) => ({
            fee: sn.fee,
            prover: sn.prover,
            workIds: sn.workIds.join(', '),
          } as ExplorerSnark)),
        ),
      );
  }
}
