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

import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { map, Subscription } from 'rxjs';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { NodeStatus } from '@shared/types/app/node-status.type';

declare global {
  namespace Cypress {
    interface Chainable {
      then(store: Store<MinaState> | any): Chainable<any>;

      then(store: Store<MinaState> | any, { timeout }: { timeout: number }): Chainable<any>;

      its(store: 'store'): Chainable<Store<MinaState>>;
    }
  }
}

export const PROMISE = (resolveFunction: (resolve: (result?: unknown) => void) => void) => new Cypress.Promise(resolveFunction);
export const storeSubscription = (store: Store<MinaState>, slice: keyof MinaState, observer: any): Subscription => store.select(slice).subscribe(observer);
export const getActiveNode = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: MinaNode) => void): void => {
    const observer = (node: MinaNode) => {
      if (node) {
        return resolve(node);
      }
      setTimeout(() => resolve(), 3000);
    };
    store.select('app').pipe(map(app => app.activeNode)).subscribe(observer);
  };
  return PROMISE(promiseBody);
};
export const getActiveNodeStatus = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: NodeStatus) => void): void => {
    const observer = (status: NodeStatus) => {
      if (status) {
        return resolve(status);
      }
      setTimeout(() => resolve(), 3000);
    };
    store.select('app').pipe(map(app => app.nodeStatus)).subscribe(observer);
  };
  return PROMISE(promiseBody);
};
export const getNodes = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (nodes: MinaNode[]) => {
      if (nodes.length) {
        return resolve(nodes);
      }
      setTimeout(() => resolve(), 3000);
    };
    store.select('app').pipe(map(app => app.nodes)).subscribe(observer);
  };
  return PROMISE(promiseBody);
};

export const stateSliceAsPromise = <T = MinaState | MinaState[keyof MinaState]>(
  store: Store<MinaState>, resolveCondition: (state: T) => boolean, slice: keyof MinaState, subSlice: string, timeout: number = 3000,
) => {
  return new Cypress.Promise((resolve: (result?: T | void) => void): void => {
    const observer = (state: T) => {
      if (resolveCondition(state)) {
        return resolve(state);
      }
      setTimeout(() => resolve(), timeout);
    };
    store.select(slice).pipe(
      map((subState: MinaState[keyof MinaState]) => {
        cy.log('');
        return subSlice ? subState[subSlice] : subState;
      }),
    ).subscribe(observer);
  });
};

export const storeNetworkSubscription = (store: Store<MinaState>, observer: any): Subscription => store.select('network').subscribe(observer);

export const storeWebNodeWalletSubscription = (store: Store<MinaState>, observer: any): Subscription => store.select('webNode').pipe(map(wn => wn.wallet)).subscribe(observer);
export const storeWebNodeLogsSubscription = (store: Store<MinaState>, observer: any): Subscription => store.select('webNode').pipe(map(wn => wn.log)).subscribe(observer);
export const storeWebNodePeersSubscription = (store: Store<MinaState>, observer: any): Subscription => store.select('webNode').pipe(map(wn => wn.peers)).subscribe(observer);
export const storeWebNodeSharedSubscription = (store: Store<MinaState>, observer: any): Subscription => store.select('webNode').pipe(map(wn => wn.shared)).subscribe(observer);

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));
