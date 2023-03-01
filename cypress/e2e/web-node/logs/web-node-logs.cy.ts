import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeWebNodeLogsSubscription, storeWebNodeSharedSubscription } from '../../../support/commands';
import { WebNodeLogsState } from '@web-node/web-node-logs/web-node-logs.state';
import { WebNodeSharedState } from '@web-node/web-node.state';

const getWebNodeShared = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (state: WebNodeSharedState) => {
      if (state.logs.length) {
        return resolve(state);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeWebNodeSharedSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

const getWebNodeLogs = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (state: WebNodeLogsState) => {
      return resolve(state);
    };
    storeWebNodeLogsSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('WEB NODE LOGS', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/web-node/logs');
  });

  it('activate logs sub menu', () => {
    cy.get('mina-toolbar .toolbar > div:first-child > span')
      .then((span: any) => expect(span.text()).equal('Web Node'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('logs'));
  });

  // it('have some logs', () => {
  //   cy.get('mina-web-node-logs cdk-virtual-scroll-viewport .row', { timeout: 60000 })
  //     .should('exist')
  //     .wait(1000)
  //     .window()
  //     .its('store')
  //     .then(getWebNodeShared)
  //     .then((logsState: WebNodeSharedState) => {
  //       expect(logsState.logs).length.at.least(1);
  //     });
  // });
  //
  // it('select log', () => {
  //   cy.get('mina-web-node-logs cdk-virtual-scroll-viewport .row:nth-child(1)', { timeout: 60000 })
  //     .click()
  //     .get('mina-web-node-logs mina-web-node-logs-side-panel mina-json-viewer')
  //     .should('exist')
  //     .wait(1000)
  //     .window()
  //     .its('store')
  //     .then(getWebNodeLogs)
  //     .then((logsState: WebNodeLogsState) => {
  //       expect(logsState.activeLog).be.not.undefined;
  //     });
  // });
  //
  // it('select log and close selected log', () => {
  //   cy.get('mina-web-node-logs cdk-virtual-scroll-viewport .row:nth-child(1)', { timeout: 60000 })
  //     .click()
  //     .get('mina-web-node-logs mina-web-node-logs-side-panel mina-json-viewer')
  //     .should('exist')
  //     .wait(1000)
  //     .window()
  //     .its('store')
  //     .then(getWebNodeLogs)
  //     .then((logsState: WebNodeLogsState) => {
  //       expect(logsState.activeLog).be.not.undefined;
  //     })
  //     .get('mina-web-node-logs mina-web-node-logs-side-panel .mina-icon')
  //     .click()
  //     .wait(1000)
  //     .get('mina-web-node-logs mina-web-node-logs-side-panel mina-json-viewer')
  //     .should('not.be.visible')
  //     .window()
  //     .its('store')
  //     .then(getWebNodeLogs)
  //     .then((logsState: WebNodeLogsState) => {
  //       expect(logsState.activeLog).be.undefined;
  //     });
  // });
});
