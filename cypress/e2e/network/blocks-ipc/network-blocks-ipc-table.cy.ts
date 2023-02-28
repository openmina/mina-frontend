import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { NetworkBlocksState } from '@network/blocks/network-blocks.state';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';

const condition = (state: NetworkBlocksIpcState) => state && state.blocks.length > 1;
const networkBlocksIpcState = (store: Store<MinaState>) => stateSliceAsPromise<NetworkBlocksIpcState>(store, condition, 'network', 'blocksIpc');


describe('NETWORK BLOCKS IPC TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/network/blocks-ipc');
  });

  it('shows correct active page', () => {
    cy.get('mina-toolbar .toolbar > div:first-child > span')
      .then((span: any) => expect(span.text()).equal('Network'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('blocks ipc'));
  });

  it('displays messages in the table', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state) {
          expect(state.blocks.length).above(1);
          cy.get('.mina-table')
            .get('.row')
            .should('have.length.above', 1);
        }
      });
  });

  it('filter by candidate', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state && state.blocks.length && state.allFilters.length > 0) {
          cy.wait(1000)
            .get('mina-network-blocks-ipc-toolbar > div:nth-child(2) button:nth-child(2)')
            .click()
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              expect(state.filteredBlocks.every(m => m.hash === state.activeFilters[0])).to.be.true;
              cy.get('.mina-table')
                .get('.row:not(.head) > span:nth-child(2)')
                .then((rows: any[]) => {
                  Array.from(rows).forEach((row: any) => {
                    expect(row.textContent).to.includes(state.activeFilters[0].substring(0, 5));
                  });
                });
            });
        }
      });
  });

  it('have as many filters as unique candidates from the messages', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state) {
          const expectedCandidates = state.blocks.map(m => m.hash).filter((v, i, a) => a.indexOf(v) === i).length;
          expect(state.allFilters.length).to.equal(expectedCandidates);
        }
      });
  });

  it('sort by date', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredBlocks.length - 1; i++) {
            const curr = state.filteredBlocks[i].date || '';
            const next = state.filteredBlocks[i + 1].date || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('has higher time than network blocks', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state) {
          const currentHeight = state.activeBlock;
        }
      });
  });
});
