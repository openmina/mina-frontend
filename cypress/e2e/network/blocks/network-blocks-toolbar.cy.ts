import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { NetworkBlocksState } from '@network/blocks/network-blocks.state';

const condition = (state: NetworkBlocksState) => state.blocks.length > 2;
const networkBlocksState = (store: Store<MinaState>) => stateSliceAsPromise<NetworkBlocksState>(store, condition, 'network', 'blocks');


describe('NETWORK BLOCKS TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/network/blocks');
  });

  it('goes to previous block', () => {
    let activeBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        activeBlock = state.activeBlock;
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        expect(activeBlock).to.equal(state.activeBlock + 1);
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('not.have.class', 'disabled');
  });

  it('goes to next block', () => {
    let activeBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        activeBlock = state.activeBlock;
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        expect(activeBlock).to.equal(state.activeBlock + 1);
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        expect(activeBlock).to.equal(state.activeBlock);
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

  it('goes to earliest block', () => {
    let earliestBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        earliestBlock = state.earliestBlock;
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .get('mina-network-blocks-toolbar > div:first-child > button')
      .should('not.have.class', 'disabled')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(networkBlocksState)
      .then((state: NetworkBlocksState) => {
        expect(earliestBlock).to.equal(state.activeBlock);
      })
      .get('mina-network-blocks-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-network-blocks-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });


});