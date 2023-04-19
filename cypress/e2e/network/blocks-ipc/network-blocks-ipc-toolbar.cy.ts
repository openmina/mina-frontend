import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { NetworkBlocksIpcState } from '@network/blocks-ipc/network-blocks-ipc.state';

const condition = (state: NetworkBlocksIpcState) => state && state.blocks.length > 0;
const networkBlocksIpcState = (store: Store<MinaState>) => stateSliceAsPromise<NetworkBlocksIpcState>(store, condition, 'network', 'blocksIpc');


describe('NETWORK BLOCKS IPC TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/network/blocks-ipc');
  });

  it('goes to previous block', () => {
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state && state.blocks.length > 2) {
          let activeBlock = state.activeBlock;
          cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              if (state && activeBlock !== undefined) {
                expect(activeBlock).to.equal(state.activeBlock + 1);
                cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
                  .should('not.have.class', 'disabled')
                  .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
                  .should('not.have.class', 'disabled');
              }
            });
        }
      });
  });

  it('goes to next block', () => {
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state && state.blocks.length > 2) {
          let activeBlock = state.activeBlock;
          cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              if (state && activeBlock !== undefined) {
                expect(activeBlock).to.equal(state.activeBlock + 1);
                cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
                  .should('not.have.class', 'disabled')
                  .click({ force: true })
                  .wait(1000)
                  .window()
                  .its('store')
                  .then(networkBlocksIpcState)
                  .then((state: NetworkBlocksIpcState) => {
                    if (state && activeBlock !== undefined) {
                      expect(activeBlock).to.equal(state.activeBlock);
                      cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
                        .should('have.class', 'disabled')
                        .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
                        .should('have.class', 'disabled');
                    }
                  });
              }
            });
        }
      });
  });

  it('goes to earliest block', () => {
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksIpcState)
      .then((state: NetworkBlocksIpcState) => {
        if (state && state.blocks.length > 2) {
          let earliestBlock = state.earliestBlock;
          cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
            .should('have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
            .should('not.have.class', 'disabled')
            .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
            .get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true })
            .wait(1000)
            .get('mina-network-blocks-ipc-toolbar > div:first-child > button')
            .should('not.have.class', 'disabled')
            .click({ force: true })
            .wait(1000)
            .window()
            .its('store')
            .then(networkBlocksIpcState)
            .then((state: NetworkBlocksIpcState) => {
              if (state && earliestBlock !== undefined) {
                expect(earliestBlock).to.equal(state.activeBlock);
                cy.get('mina-network-blocks-ipc-toolbar > div:first-child .pagination-group button:last-child')
                  .should('have.class', 'disabled')
                  .get('mina-network-blocks-ipc-toolbar > div:first-child button:last-child')
                  .should('have.class', 'disabled');
              }
            });
        }
      });
  });
});
