import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { NetworkConnectionsState } from '@network/connections/network-connections.state';

const condition = (state: NetworkConnectionsState) => state && state.connections.length > 2;
const networkConnectionsState = (store: Store<MinaState>) => stateSliceAsPromise<NetworkConnectionsState>(store, condition, 'network', 'connections');


describe('NETWORK CONNECTIONS TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/network/connections');
  });

  it('shows correct active page', () => {
    cy.wait(1000)
      .get('mina-toolbar .toolbar > div:first-child > span')
      .then((span: any) => expect(span.text()).equal('Network'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('connections'));
  });

  it('displays connections in the table', () => {
    cy.window()
      .its('store')
      .then(networkConnectionsState)
      .then((state: NetworkConnectionsState) => {
        if (state && state.connections.length > 2) {
          expect(state.connections.length).above(2);
          cy.get('mina-network-connections .mina-table')
            .find('.row:not(.head)')
            .should('have.length.above', 2);
        }
      });
  });

  it('assert that connections are sorted by date', () => {
    cy.window()
      .its('store')
      .then(networkConnectionsState)
      .then((state: NetworkConnectionsState) => {
        if (state && state.connections.length > 2) {
          let sorted = true;
          for (let i = 0; i < state.connections.length - 1; i++) {
            const curr = state.connections[i].date || '';
            const next = state.connections[i + 1].date || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('click on remote address routes to network messages', () => {
    cy.window()
      .its('store')
      .then(networkConnectionsState)
      .then((state: NetworkConnectionsState) => {
        if (state && state.connections.length > 2) {
          cy.get('mina-network-connections .mina-table')
            .find('.row:not(.head)')
            .first()
            .find('span:nth-child(3) span')
            .click()
            .wait(1000)
            .url()
            .should('include', '/network/messages?addr=' + state.connections[0].addr);
        }
      });
  });

  it('for each row assert that the id is displayed correctly', () => {
    cy.window()
      .its('store')
      .then(networkConnectionsState)
      .then((state: NetworkConnectionsState) => {
        if (state && state.connections.length > 2) {
          cy.get('mina-network-connections .mina-table')
            .find('.row:not(.head) > span:nth-child(1)')
            .each((row: any, index: number) => {
              const id = state.connections[index].connectionId.toString();
              expect(row.text()).equal(id);
            });
        }
      });
  });

});
