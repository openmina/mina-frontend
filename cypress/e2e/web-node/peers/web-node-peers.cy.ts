import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeWebNodeLogsSubscription, storeWebNodePeersSubscription, storeWebNodeSharedSubscription } from '../../../support/commands';
import { WebNodeSharedState } from '@web-node/web-node.state';
import { WebNodeLogsState } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodePeersState } from '@web-node/web-node-peers/web-node-peers.state';

const getWebNodeShared = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (state: WebNodeSharedState) => {
      if (state.peers.length) {
        return resolve(state);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeWebNodeSharedSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

const getWebNodePeers = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (state: WebNodePeersState) => {
      return resolve(state);
    };
    storeWebNodePeersSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('WEB NODE PEERS', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/web-node/peers');
  });

  it('activate peers sub menu', () => {
    cy.get('mina-toolbar .submenus a.active')
      .then((a: JQuery<HTMLAnchorElement>) => {
        expect(a.text()).equals('peers');
      });
  });
  it('have some peers', () => {
    cy.get('mina-web-node-peers cdk-virtual-scroll-viewport .row', { timeout: 60000 })
      .should('exist')
      .wait(1000)
      .window()
      .its('store')
      .then(getWebNodeShared)
      .then((logsState: WebNodeSharedState) => {
        expect(logsState.peers).length.at.least(1);
      });
  });

  it('select peer', () => {
    cy.get('mina-web-node-peers cdk-virtual-scroll-viewport .row:nth-child(1)', { timeout: 60000 })
      .click()
      .get('mina-web-node-peers mina-web-node-peers-side-panel mina-json-viewer')
      .should('exist')
      .wait(1000)
      .window()
      .its('store')
      .then(getWebNodePeers)
      .then((state: WebNodePeersState) => {
        expect(state.activePeer).be.not.undefined;
      });
  });

  it('select peer and close selected peer', () => {
    cy.get('mina-web-node-peers cdk-virtual-scroll-viewport .row:nth-child(1)', { timeout: 60000 })
      .click()
      .get('mina-web-node-peers mina-web-node-peers-side-panel mina-json-viewer')
      .should('exist')
      .wait(1000)
      .window()
      .its('store')
      .then(getWebNodePeers)
      .then((state: WebNodePeersState) => {
        expect(state.activePeer).be.not.undefined;
      })
      .get('mina-web-node-peers mina-web-node-peers-side-panel .mina-icon')
      .click()
      .wait(1000)
      .get('mina-web-node-peers mina-web-node-peers-side-panel mina-json-viewer')
      .should('not.be.visible')
      .window()
      .its('store')
      .then(getWebNodePeers)
      .then((state: WebNodePeersState) => {
        expect(state.activePeer).be.undefined;
      });
  });

});
