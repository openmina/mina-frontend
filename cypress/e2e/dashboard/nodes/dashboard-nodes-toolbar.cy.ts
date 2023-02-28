import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';

const condition = (state: DashboardNodesState) => state && state.nodes.length > 1;
const getDashboard = (store: Store<MinaState>) => stateSliceAsPromise<DashboardNodesState>(store, condition, 'dashboard', 'nodes');


describe('DASHBOARD NODES TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/dashboard');
  });

  it('goes to previous block', () => {
    let activeBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state) {
          activeBlock = state.activeBlock;
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state && activeBlock !== undefined) {
          expect(activeBlock).to.equal(state.activeBlock + 1);
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('not.have.class', 'disabled');
  });

  it('goes to next block', () => {
    let activeBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state) {
          activeBlock = state.activeBlock;
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state && activeBlock !== undefined) {
          expect(activeBlock).to.equal(state.activeBlock + 1);
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state && activeBlock !== undefined) {
          expect(activeBlock).to.equal(state.activeBlock);
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

  it('goes to earliest block', () => {
    let earliestBlock: number;
    cy.wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state) {
          earliestBlock = state.earliestBlock;
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
      .click({ force: true })
      .wait(1000)
      .get('mina-dashboard-nodes-toolbar .row1 > button')
      .should('not.have.class', 'disabled')
      .click({ force: true })
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        cy.log(JSON.stringify(state.nodes))
        if (state && earliestBlock !== undefined) {
          expect(earliestBlock).to.equal(state.activeBlock);
        }
      })
      .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-nodes-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

});
