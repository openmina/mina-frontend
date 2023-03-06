import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeWebNodeWalletSubscription } from '../../../support/commands';
import { WebNodeWalletState } from '@web-node/web-node-wallet/web-node-wallet.state';

const getWebNodeWallet = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (walletState: WebNodeWalletState) => {
      if (walletState.wallets.length) {
        return resolve(walletState);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeWebNodeWalletSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('WEB NODE WALLET', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/web-node/wallet');
  });

  it('navigate to transaction creation', () => {
    cy.window()
      .its('store')
      .then(getWebNodeWallet)
      .get('.wallet-toolbar div button')
      .click({ force: true })
      .wait(5000)
      .url()
      .should('include', '/wallet/new-transaction');
  });

  it('displays web node title', () => {
    cy.get('mina-toolbar .toolbar > div:first-child > span')
      .then((span: any) => expect(span.text()).equal('Web Node'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('wallet'));
  });

  it('render web node sub menus', () => {
    cy.get('mina-toolbar mina-submenu-tabs a')
      .should('have.length', 4)
      .then((aTags: any[]) => {
        expect(aTags[0].textContent).equals('wallet');
        expect(aTags[1].textContent).equals('peers');
        expect(aTags[2].textContent).equals('logs');
        expect(aTags[3].textContent).equals('state');
      });
  });

  it('activate wallet sub menu', () => {
    cy.get('mina-toolbar mina-submenu-tabs a.active')
      .then((a: JQuery<HTMLAnchorElement>) => {
        expect(a.text()).equals('wallet');
      });
  });

  it('navigate to wallet creation', () => {
    cy.window()
      .its('store')
      .then(getWebNodeWallet)
      .get('.wallet-toolbar button')
      .eq(-1)
      .click({ force: true })
      .url()
      .should('include', '/wallet/new');
  });
});
