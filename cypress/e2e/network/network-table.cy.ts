import { NetworkMessagesState } from '@network/messages/network-messages.state';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeNetworkSubscription } from '../../support/commands';
import { NetworkMessage } from '@shared/types/network/messages/network-message.type';

const getNetwork = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (network: NetworkMessagesState) => {
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
      .then((network: NetworkMessagesState) => {
        expect(network.messages.length).above(20);
        cy.get('mina-network .mina-table')
          .get('.row')
          .should('have.length.above', 15);
      });
  });

  it('toggle address filter on address click', () => {
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        if (network.messages) {
          cy.wait(1000)
            .get('mina-network .mina-table .row:last-child span:nth-child(3)')
            .click()
            .get('.filter-row div:nth-child(2) button').should('have.length', 1)
            .url().should('contain', 'addr=' + network.messages[network.messages.length - 1].address)
            .wait(2000)
            .get('mina-network .mina-table .row:last-child span:nth-child(3)')
            .click()
            .get('.filter-row div:nth-child(2) button').should('have.length', 0)
            .url().should('not.contain', 'addr=');
        }
      });
  });

  it('toggle filter on stream kind cell click', () => {
    let clickedMessage: NetworkMessage;
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
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
      .then((network: NetworkMessagesState) => {
        expect(network.messages.every(m => m.streamKind === clickedMessage.streamKind)).to.be.true;
        cy.get('mina-network .mina-table .row:not(.head) span:nth-child(6)')
          .should((elements: JQuery<HTMLSpanElement>) => {
            elements.each((i: number) => {
              expect(elements[i].textContent).to.equal(clickedMessage.streamKind);
            });
          });
      });
  });

  it('select message on click', () => {
    let clickedMessage: NetworkMessage;
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        if (network.messages) {
          clickedMessage = network.messages[network.messages.length - 2];
          cy.wait(1000)
            .get('mina-network .mina-table .row')
            .eq(-2)
            .find('span:nth-child(2)')
            .click()
            .wait(1000)
            .url().should('contain', '/' + clickedMessage.id)
            .window()
            .its('store')
            .then(getNetwork)
            .then((network: NetworkMessagesState) => {
              expect(network.activeRow).equals(clickedMessage);
            });
        }
      });
  });

  it('deselect message on closing side panel', () => {
    let clickedMessage: NetworkMessage;
    cy.window()
      .its('store')
      .then(getNetwork)
      .then((network: NetworkMessagesState) => {
        if (network.messages) {
          clickedMessage = network.messages[network.messages.length - 2];
          cy.wait(1000)
            .get('mina-network .mina-table .row')
            .eq(-2)
            .find('span:nth-child(2)')
            .click()
            .wait(1000)
            .url().should('contain', '/' + clickedMessage.id)
            .window()
            .its('store')
            .then(getNetwork)
            .then((network: NetworkMessagesState) => {
              expect(network.activeRow).equals(clickedMessage);
            })
            .get('mina-network-side-panel .mina-icon')
            .click()
            .wait(500)
            .url().should('not.contain', 'network/')
            .get('mina-network-side-panel button')
            .should('not.be.visible')
            .window()
            .its('store')
            .then(getNetwork)
            .then((network: NetworkMessagesState) => {
              expect(network.activeRow).to.be.undefined;
            });
        }
      });
  });

  it('stop getting messages if there is an ongoing messages request', () => {
    let responseCount: number = 0;
    cy.get('mina-network-table-footer .pause-button')
      .click()
      .wait(8000)
      .intercept('/messages?limit=1000&direction=reverse', req => {
        req.continue(res => {
          res.delay = 30000;
          responseCount++;
          res.send();
        });
      })
      .as('getMessages')
      .get('mina-network-table-footer .live-button')
      .click()
      .wait(30000)
      .then(() => {
        expect(responseCount).equals(1);
      });
  });
});
