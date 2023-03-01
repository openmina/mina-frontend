import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getActiveNode, stateSliceAsPromise } from '../../../support/commands';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

const condition = (state: NetworkBlocksIpcState) => state && state.blocks.length > 0;
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
          expect(state.blocks.length).above(0);
          cy.get('.mina-table')
            .get('.row')
            .should('have.length.above', 0);
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
        if (state && state.filteredBlocks.length > 1) {
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

  it('current block ipc has higher time than network blocks', () => {
    cy.window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state) {
          const currentHeight = state.activeBlock;
          cy.window()
            .its('store')
            .then(getActiveNode)
            .then((node: MinaNode) => {
              cy.request(`${node.debugger}/block/${currentHeight}`)
                .then((response: any) => {
                  const blocks = response.body.events;
                  const filteredBlocks = blocks.filter((b: any) => b.hash === state.allFilters[0]);
                  expect(filteredBlocks).to.have.length.above(0);
                  const filteredBlocksIpc = state.blocks.filter((b: any) => b.hash === state.allFilters[0]);
                  const blockTimeString = getTimestamp(filteredBlocks[0].time);
                  const blockTime = Number(blockTimeString.substring(0, blockTimeString.length - 3));
                  const blockIpcTime = filteredBlocksIpc[0].timestamp;
                  expect(blockTime).to.be.below(blockIpcTime);
                  expect(filteredBlocksIpc[0].hash).to.equal(filteredBlocks[0].hash);
                });
            });
        }
      });
  });

  it('current block ipc has higher time than network blocks 2 blocks before', () => {
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state && state.activeBlock > 3) {
          cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              if (state) {
                const currentHeight = state.activeBlock;
                cy.window()
                  .its('store')
                  .then(getActiveNode)
                  .then((node: MinaNode) => {
                    cy.request(`${node.debugger}/block/${currentHeight}`)
                      .then((response: any) => {
                        const blocks = response.body.events;
                        const filteredBlocks = blocks.filter((b: any) => b.hash === state.allFilters[0]);
                        expect(filteredBlocks).to.have.length.above(0);
                        const filteredBlocksIpc = state.blocks.filter((b: any) => b.hash === state.allFilters[0]);
                        const blockTimeString = getTimestamp(filteredBlocks[0].time);
                        const blockTime = Number(blockTimeString.substring(0, blockTimeString.length - 3));
                        const blockIpcTime = filteredBlocksIpc[0].timestamp;
                        expect(blockTime).to.be.below(blockIpcTime);
                        expect(filteredBlocksIpc[0].hash).to.equal(filteredBlocks[0].hash);
                      });
                  });
              }
            });
        }
      });
  });

  it('current block ipc has higher time than network blocks - check 100 levels', () => {
    let blocksToCheck: number;
    let debuggerUrl: string;
    cy.wait(1000)
      .window()
      .its('store')
      .then(getActiveNode)
      .then((node: MinaNode) => {
        debuggerUrl = node.debugger;
      })
      .window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        blocksToCheck = state && state.activeBlock > 101 ? 100 : state.activeBlock - 1;

        function compareBlocks(count: number) {
          if (count <= 0) {
            return;
          }
          cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              if (state) {
                const currentHeight = state.activeBlock;
                cy.request(`${debuggerUrl}/block/${currentHeight}`, { timeout: 10000 })
                  .then((response: any) => {
                    if (response && response.status === 200) {
                      const blocks = response.body.events;
                      const filteredBlocks = blocks.filter((b: any) => b.hash === state.allFilters[0]);
                      expect(filteredBlocks).to.have.length.above(0);
                      const firstBlockIpc = state.blocks.find((b: any) => b.hash === state.allFilters[0]);
                      const blockTimeString = getTimestamp(filteredBlocks[0].time);
                      const blockTime = Number(blockTimeString.substring(0, blockTimeString.length - 3));
                      const blockIpcTime = firstBlockIpc.timestamp;
                      expect(blockTime).to.be.below(blockIpcTime);
                      expect(firstBlockIpc.hash).to.equal(filteredBlocks[0].hash);
                    }
                  });
              }
            });
          compareBlocks(count - 1);
        }

        if (state && state.activeBlock > 2) {
          compareBlocks(blocksToCheck);
        }
      });
  });
});

function getTimestamp(time: any): string {
  const secs = time.secs_since_epoch;
  const nano = time.nanos_since_epoch;
  let newNano: string = '' + nano;

  while (newNano.length < 9) {
    newNano = '0' + newNano;
  }

  return secs + '' + newNano;
}
