import { NetworkMessagesState } from '@network/messages/network-messages.state';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeNetworkSubscription } from '../../support/commands';

const getNetwork = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (network: NetworkMessagesState) => resolve(network);
    storeNetworkSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('NETWORK FILTERS', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/network');
  });

  it('toggle filters', () => {
    cy.get('.filters-container div:nth-child(5)')
      .should('not.exist')
      .get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(5)')
      .should('exist')
      .get('.toggle-filters')
      .click()
      .wait(600)
      .get('.filters-container div:nth-child(5)')
      .should('exist')
      .should('not.be.visible');

  });

  it('filter messages by noise', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(3) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'handshake_payload,failed_to_decrypt');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.streamKind === '/noise')).to.be.true;
      });
  });

  it('filter messages by kad', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(3) .flex-row:nth-child(2) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'put_value,get_value,add_provider,get_providers,find_node,ping');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 6);
        expect(network.messages.every(message => message.streamKind === '/coda/kad/1.0.0')).to.be.true;
      });
  });

  it('filter messages by multistream', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(2) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', encodeURIComponent('/multistream/1.0.0'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 1);
        expect(network.messages.every(message => message.streamKind === '/multistream/1.0.0')).to.be.true;
      });
  });

  it('filter messages by coda mplex', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(2) .flex-row:nth-child(2) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', encodeURIComponent('/coda/mplex/1.0.0'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 1);
        expect(network.messages.every(message => message.streamKind === '/coda/mplex/1.0.0')).to.be.true;
      });
  });

  it('filter messages by identify', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(5) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', encodeURIComponent('/ipfs/id/1.0.0'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 1);
        expect(network.messages.every(message => message.streamKind === '/ipfs/id/1.0.0')).to.be.true;
      });
  });

  it('filter messages by IPFS push', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(5) .flex-row:nth-child(2) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', encodeURIComponent('/ipfs/id/push/1.0.0'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 1);
        expect(network.messages.every(message => message.streamKind === '/ipfs/id/push/1.0.0')).to.be.true;
      });
  });

  it('filter messages by meshsub', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'subscribe,unsubscribe,meshsub_control,publish_external_transition,publish_snark_pool_diff,publish_transaction_pool_diff');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 6);
        expect(network.messages.every(message => message.streamKind === '/meshsub/1.1.0')).to.be.true;
      });
  });

  it('filter messages by rpcs', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(7) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'get_some_initial_peers,get_staged_ledger_aux_and_pending_coinbases_at_hash,answer_sync_ledger_query,get_ancestry,get_best_tip,get_node_status,get_transition_chain_proof,get_transition_chain,get_transition_knowledge,get_epoch_ledger,__Versioned_rpc.Menu,ban_notify');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 12);
        expect(network.messages.every(message => message.streamKind === 'coda/rpcs/0.0.1')).to.be.true;
      });
  });

  it('filter messages by unknown', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(8) .flex-row:nth-child(1) .category')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', encodeURIComponent('unknown'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 1);
        expect(network.messages.every(message => message.streamKind === 'unknown')).to.be.true;
      });
  });

  // failing - broken backend
  it('filter messages by subscribe and publish snark pool diff', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(2)')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(6)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'subscribe');
        cy.url().should('include', 'snark_pool_diff');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.messageKind === 'subscribe' || message.messageKind === 'snark_pool_diff')).to.be.true;
      });
  });

  it('filter messages by control and external transition', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(4)')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(5)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'control');
        cy.url().should('include', 'external_transition');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.messageKind === 'control' || message.messageKind === 'external_transition')).to.be.true;
      });
  });

  it('filter messages by get epoch ledger and versioned rpc menu', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(7) .flex-row:nth-child(1) .filter:nth-child(11)')
      .click()
      .get('.filters-container div:nth-child(7) .flex-row:nth-child(1) .filter:nth-child(12)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'get_epoch_ledger');
        cy.url().should('include', encodeURIComponent('__Versioned_rpc.Menu'));
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.messageKind.includes('get_epoch_ledger') || message.messageKind.includes('__Versioned_rpc.Menu'))).to.be.true;
      });
  });

  it('filter messages by find node and get ancestry', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(7) .flex-row:nth-child(1) .filter:nth-child(5)')
      .click()
      .get('.filters-container div:nth-child(3) .flex-row:nth-child(2) .filter:nth-child(6)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'get_ancestry');
        cy.url().should('include', 'find_node');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.messageKind.includes('get_ancestry') || message.messageKind === 'find_node')).to.be.true;
      });
  });

  // failing - broken backend
  it('filter messages by transaction pool diff and answer sync ledger query', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(7)')
      .click()
      .get('.filters-container div:nth-child(7) .flex-row:nth-child(1) .filter:nth-child(4)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        cy.url().should('include', 'answer_sync_ledger_query');
        cy.url().should('include', 'publish_transaction_pool_diff');
        cy.get('.filter-row div:nth-child(2) button').should('have.length', 2);
        expect(network.messages.every(message => message.messageKind.includes('answer_sync_ledger_query') || message.messageKind === 'transaction_pool_diff')).to.be.true;
      });
  });


  it('filter messages by control and delete the filter', () => {
    cy.get('.toggle-filters')
      .click()
      .get('.filters-container div:nth-child(6) .flex-row:nth-child(1) .filter:nth-child(4)')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        expect(network.messages.every(message => message.messageKind === 'control')).to.be.true;
        cy.url().should('include', 'control')
          .get('.filter-row div:nth-child(2) button').should('have.length', 1)
          .get('.filter-row div:nth-child(2) button:nth-child(1)')
          .click()
          .get('.filter-row div:nth-child(2) button').should('have.length', 0)
          .url().should('not.include', 'control')
          .wait(1500)
          .window()
          .its('store')
          .then(getNetwork)
          .then((network: NetworkMessagesState) => {
            expect(network.messages.every(message => message.messageKind === 'control')).to.be.false;
          });
      });
  });
});

