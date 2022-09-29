/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';

declare global {
  namespace Cypress {
    interface Chainable {
      then(store: Store<MinaState> | any): Chainable<any>;
      its(store: 'store'): Chainable<Store<MinaState>>;
    }
  }
}

export const PROMISE = (resolveFunction: (resolve: (result?: unknown) => void) => void) => new Cypress.Promise(resolveFunction);
export const storeSubscription = (store: Store<MinaState>, slice: keyof MinaState, observer: any) => store.select(slice).subscribe(observer);
export const storeNetworkSubscription = (store: Store<MinaState>, observer: any) => store.select('network').subscribe(observer);
