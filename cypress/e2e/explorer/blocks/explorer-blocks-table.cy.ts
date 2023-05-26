import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { ExplorerBlocksState } from '@explorer/blocks/explorer-blocks.state';

const condition = (state: ExplorerBlocksState) => state && state.blocks.length > 1;
const getBlocks = (store: Store<MinaState>) => stateSliceAsPromise<ExplorerBlocksState>(store, condition, 'explorer', 'blocks');

describe('EXPLORER BLOCKS TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/explorer/blocks');
  });

  it('display explorer title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Explorer'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('blocks'));
  });

  it('render explorer sub menus', () => {
    cy.get('mina-toolbar mina-submenu-tabs a')
      .should('have.length', 5)
      .then((aTags: any[]) => {
        expect(aTags[0].textContent).equals('blocks');
        expect(aTags[1].textContent).equals('transactions');
        expect(aTags[2].textContent).equals('snark pool');
        expect(aTags[3].textContent).equals('scan state');
        expect(aTags[4].textContent).equals('snark traces');
      });
  });

  it('display blocks in the table', () => {
    cy.window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          expect(state.blocks.length).above(1);
          cy.get('mina-explorer-blocks-table .mina-table')
            .get('.row:not(.head)')
            .should('have.length.above', 1);
        }
      });
  });

  it('by default, sort table by timestamp', () => {
    cy.window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            if (state.blocks[i].timestamp <= state.blocks[i + 1].timestamp) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by hash', () => {
    cy.get('.mina-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].hash || '';
            const next = state.blocks[i + 1].hash || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by hash reversed', () => {
    cy.get('.mina-table .head > span:nth-child(2)')
      .click()
      .get('.mina-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].hash || '';
            const next = state.blocks[i + 1].hash || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by height', () => {
    cy.get('.mina-table .head > span:nth-child(3)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].height === undefined ? state.blocks[i].height : Number.MAX_VALUE;
            const next = state.blocks[i + 1].height === undefined ? state.blocks[i + 1].height : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by global slot', () => {
    cy.get('.mina-table .head > span:nth-child(4)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].globalSlot === undefined ? state.blocks[i].globalSlot : Number.MAX_VALUE;
            const next = state.blocks[i + 1].globalSlot === undefined ? state.blocks[i + 1].globalSlot : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by user commands', () => {
    cy.get('.mina-table .head > span:nth-child(5)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].totalTxCount === undefined ? state.blocks[i].totalTxCount : Number.MAX_VALUE;
            const next = state.blocks[i + 1].totalTxCount === undefined ? state.blocks[i + 1].totalTxCount : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by total txs', () => {
    cy.get('.mina-table .head > span:nth-child(6)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].txCount === undefined ? state.blocks[i].txCount : Number.MAX_VALUE;
            const next = state.blocks[i + 1].txCount === undefined ? state.blocks[i + 1].txCount : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by snark jobs', () => {
    cy.get('.mina-table .head > span:nth-child(7)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].snarkCount === undefined ? state.blocks[i].snarkCount : Number.MAX_VALUE;
            const next = state.blocks[i + 1].snarkCount === undefined ? state.blocks[i + 1].snarkCount : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by staged ledger hash reversed', () => {
    cy.get('.mina-table .head > span:nth-child(8)')
      .click()
      .get('.mina-table .head > span:nth-child(8)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].stagedLedgerHash || '';
            const next = state.blocks[i + 1].stagedLedgerHash || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by snarked ledger hash reversed', () => {
    cy.get('.mina-table .head > span:nth-child(9)')
      .click()
      .get('.mina-table .head > span:nth-child(9)')
      .click()
      .window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.blocks.length - 1; i++) {
            const curr = state.blocks[i].snarkedLedgerHash || '';
            const next = state.blocks[i + 1].snarkedLedgerHash || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('open block height in scan state', () => {
    cy.window()
      .its('store')
      .then(getBlocks)
      .then((state: ExplorerBlocksState) => {
        if (state) {
          const firstBlock = state.blocks[0];
          cy.get('.mina-table .row:not(.head):first-child span:nth-child(3) > span')
            .click()
            .wait(1000)
            .log('')
            .url()
            .should('include', '/explorer/scan-state/' + firstBlock.height);
        }
      });
  });

});
