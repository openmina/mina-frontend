import { NetworkState } from '@network/network.state';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeNetworkSubscription } from '../../support/commands';
import { NetworkMessage } from '@shared/types/network/network-message.type';

const getNetwork = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (network: NetworkState) => {
      if (network.messages.length > 20) {
        return resolve(network);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeNetworkSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('NETWORK TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/network');
  });

  it('displays network title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Network'));
  });

  it('displays messages in the table', () => {
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkState) => {
        if (network.messages.length > 20) {
          expect(network.messages.length).above(20);
          cy.get('mina-network .mina-table')
            .get('.row')
            .should('have.length.above', 15);
        }
      });
  });

  it('toggle address filter on address click', () => {
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkState) => {
        if (network.messages) {
          cy.wait(1000)
            .get('mina-network .mina-table .row:last-child span:nth-child(3)')
            .click()
            .get('.filter-row div:nth-child(2) button').should('have.length', 1)
            .url().should('contain', 'connection_id=' + network.messages[network.messages.length - 1].connectionId)
            .wait(2000)
            .get('mina-network .mina-table .row:last-child span:nth-child(3)')
            .click()
            .get('.filter-row div:nth-child(2) button').should('have.length', 0)
            .url().should('not.contain', 'connection_id=');
        }
      });
  });

  it('toggle filter on stream kind cell click', () => {
    let clickedMessage: NetworkMessage;
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkState) => {
        if (network.messages) {
          clickedMessage = network.messages[network.messages.length - 1];
          cy.wait(1000)
            .get('mina-network .mina-table .row:last-child span:nth-child(6)')
            .click()
            .get('.filter-row div:nth-child(2) button').should('have.length.above', 0)
            .url().should('contain', '_kind=')
            .wait(2000);
        }
      })
      .window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkState) => {
        expect(network.messages.every(m => m.streamKind === clickedMessage.streamKind)).to.be.true;
        cy.get('mina-network .mina-table .row:not(.head) span:nth-child(6)')
          .should((elements: JQuery<HTMLSpanElement>) => {
            elements.each((i: number) => {
              expect(elements[i].textContent).to.equal(clickedMessage.streamKind);
            });
          });
      });
  });

  // it.only('select message on click', () => {
  //   let clickedMessage: NetworkMessage;
  //   cy.window()
  //     .its('store')
  //     .then(getNetwork)
  //     .then((network: NetworkState) => {
  //       if (network.messages) {
  //         clickedMessage = network.messages[network.messages.length - 2];
  //         cy.wait(1000)
  //           .get('mina-network .mina-table .row')
  //           .eq(-2)
  //           .find('span:nth-child(2)')
  //           .click()
  //           .wait(1000)
  //           .url().should('contain', '/' + clickedMessage.id)
  //           .wait(2000);
  //       }
  //     });
  // });
});
