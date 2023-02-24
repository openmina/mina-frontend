import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeDashboardSubscription } from '../../../support/commands';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';

const getDashboard = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (dashboard: DashboardNodesState) => {
      if (dashboard.filteredNodes.length > 2) {
        return resolve(dashboard);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeDashboardSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('DASHBOARD NODES TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/dashboard');
  });

  it('goes to previous block', () => {
    let activeBlock: number;
    cy
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        activeBlock = dashboard.activeBlock;
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .realClick()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock + 1);
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('not.have.class', 'disabled');
  });

  it('goes to next block', () => {
    let activeBlock: number;
    cy
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        activeBlock = dashboard.activeBlock;
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .realClick()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock + 1);
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .realClick()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock);
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

  it('goes to earliest block', () => {
    let earliestBlock: number;
    cy
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        earliestBlock = dashboard.earliestBlock;
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .realClick()
      .wait(1000)
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .realClick()
      .wait(1000)
      .get('mina-dashboard-nodes-toolbar .row1 > button')
      .should('not.have.class', 'disabled')
      .realClick()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        expect(earliestBlock).to.equal(dashboard.activeBlock);
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

});
