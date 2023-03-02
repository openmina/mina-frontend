import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { ExplorerSnarksState } from '@explorer/snarks/explorer-snarks.state';

const condition = (state: ExplorerSnarksState) => state && state.snarks.length > 1;
const getSnarkPool = (store: Store<MinaState>) => stateSliceAsPromise<ExplorerSnarksState>(store, condition, 'explorer', 'snarks', 10000);

describe('EXPLORER SNARK POOL TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/explorer/snark-pool');
  });

  it('display explorer title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Explorer'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('snark pool'));
  });

  it('display snarks in the table', () => {
    cy.window()
      .its('store')
      .then(getSnarkPool)
      .then((state: ExplorerSnarksState) => {
        if (state) {
          expect(state.snarks.length).above(1);
          cy.get('.mina-table')
            .get('.row:not(.head)')
            .should('have.length.above', 1);
        }
      });
  });

  it('by default, sort table by prover', () => {
    cy.window()
      .its('store')
      .then(getSnarkPool)
      .then((state: ExplorerSnarksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.snarks.length - 1; i++) {
            const curr = state.snarks[i].prover || '';
            const next = state.snarks[i + 1].prover || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by fee', () => {
    cy.get('.mina-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getSnarkPool)
      .then((state: ExplorerSnarksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.snarks.length - 1; i++) {
            const curr = state.snarks[i].fee || '';
            const next = state.snarks[i + 1].fee || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by work ids', () => {
    cy.get('.mina-table .head > span:nth-child(3)')
      .click()
      .window()
      .its('store')
      .then(getSnarkPool)
      .then((state: ExplorerSnarksState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.snarks.length - 1; i++) {
            const curr = state.snarks[i].workIds || '';
            const next = state.snarks[i + 1].workIds || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });
});
