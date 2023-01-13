import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeDashboardSubscription } from '../../support/commands';
import { AggregatorState } from '@dashboard/aggregator/aggregator.state';

const getDashboard = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (dashboard: AggregatorState) => {
      if (dashboard.messages.length > 2) {
        return resolve(dashboard);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeDashboardSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('DASHBOARD TOOLBAR', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/dashboard');
  });

  it('goes to previous block', () => {
    let activeBlock: number;
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        activeBlock = dashboard.activeBlock;
      })
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:first-child')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock + 1);
      })
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child button:last-child')
      .should('not.have.class', 'disabled');
  });

  it('goes to next block', () => {
    let activeBlock: number;
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        activeBlock = dashboard.activeBlock;
      })
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:first-child')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock + 1);
      })
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:last-child')
      .should('not.have.class', 'disabled')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        expect(activeBlock).to.equal(dashboard.activeBlock);
      })
      .get('mina-dashboard-toolbar > div:first-child .pagination-group button:last-child')
      .should('have.class', 'disabled')
      .get('mina-dashboard-toolbar > div:first-child button:last-child')
      .should('have.class', 'disabled');
  });

});
