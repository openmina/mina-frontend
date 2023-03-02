import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { ExplorerSnarksState } from '@explorer/snarks/explorer-snarks.state';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';

const condition = (state: ExplorerSnarksState) => state && state.snarks.length > 1;
const getSnarkPool = (store: Store<MinaState>) => stateSliceAsPromise<ExplorerSnarksState>(store, condition, 'explorer', 'snarks', 10000);

describe('EXPLORER SNARK POOL TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/explorer/snark-pool');
  });

  it('display total number of snark jobs and work ids', () => {
    cy.window()
      .its('store')
      .then(getSnarkPool)
      .then((state: ExplorerSnarksState) => {
        if (state) {
          const workIdsCount = state.snarks.reduce((sum: number, curr: ExplorerSnark) => sum + curr.workIds.split(',').length, 0);
          cy.get('mina-explorer-snarks-table > div > div:first-child > div')
            .then((div: any) => {
              expect(div.text()).contain(state.snarks.length + ' snark jobs');
              expect(div.text()).contain(workIdsCount + ' work ids');
            })
        }
      });
  });
});
