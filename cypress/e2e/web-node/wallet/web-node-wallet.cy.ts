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
    cy.visit(Cypress.env('baseUrl') + '/web-node/wallet');
  });

  it('displays web node title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Web Node'));
  });

  it('render web node sub menus', () => {
    cy.get('mina-toolbar .submenus a')
      .should('have.length', 3)
      .then((aTags: any[]) => {
        expect(aTags[0].textContent).equals('wallet');
        expect(aTags[1].textContent).equals('peers');
        expect(aTags[2].textContent).equals('logs');
      });
  });

  it('activate wallet sub menu', () => {
    cy.get('mina-toolbar .submenus a.active')
      .then((a: JQuery<HTMLAnchorElement>) => {
        expect(a.text()).equals('wallet');
      });
  });

  it('create a wallet', () => {
    let publicKey: string;
    cy.window()
      .its('store')
      .then(getWebNodeWallet)
      .get('.wallet-toolbar button')
      .eq(-1)
      .click()
      .then(() => cy.url().should('include', '/wallet/new'))
      .get('.stepper-footer button:last-child')
      .click()
      .wait(1000)
      .get('mina-stepper .stepper-body .monospace')
      .then((keys: any[]) => {
        publicKey = keys[0].textContent;
        expect(keys[0].textContent).have.length.above(10);
        expect(keys[1].textContent).have.length.above(10);
      })
      .get('.stepper-footer button:last-child')
      .click()
      .wait(500)
      .intercept('/faucet').as('getTokens')
      .get('.stepper-footer button:last-child')
      .click()
      .wait('@getTokens')
      .wait(1000)
      .get('.stepper-footer button:last-child')
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getWebNodeWallet)
      .then((walletState: WebNodeWalletState) => {
        expect(publicKey).equals(walletState.activeWallet.publicKey);
      });
  });

  it('create a stressing', () => {
    cy.window()
      .its('store')
      .then(getWebNodeWallet)
      .get('.wallet-toolbar div button')
      .click()
      .then(() => cy.url().should('include', '/wallet/new-stressing'))
      .get('form')
      .find('input')
      .eq(0)
      .type('1')
      .get('form')
      .find('input')
      .eq(1)
      .type('1')
      .get('.stepper-footer .btn-selected')
      .click()
      .wait(500)
      .get('.stepper-footer .btn-selected')
      .click()
      .wait(500)
      .get('.stepper-footer .btn-selected')
      .click()
      .wait(10000)
      .get('mina-web-node-wallet-transactions cdk-virtual-scroll-viewport .row', { timeout: 20000 })
      .should('exist')
      .window()
      .its('store')
      .then(getWebNodeWallet)
      .then((walletState: WebNodeWalletState) => {
        expect(walletState.transactions).have.length.least(1);
        expect(walletState.transactions.find(t => t.status === 'pending')).to.not.be.undefined;
        expect(walletState.transactions.some(t => t.from === walletState.activeWallet.publicKey)).to.be.true;
      });
  });

  it('switch wallet', () => {
    cy.window()
      .its('store')
      .then(getWebNodeWallet)
      .get('.wallet-toolbar .btn-selected')
      .click()
      .wait(500)
      .get('.cdk-overlay-container .dropdown-item:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getWebNodeWallet)
      .then((walletState: WebNodeWalletState) => {
        expect(walletState.activeWallet).equals(walletState.wallets[1]);
      });
  });
});
