import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { TracingBlocksState } from '@tracing/tracing-blocks/tracing-blocks.state';

const condition = (state: TracingBlocksState) => state && state.traces.length > 1;
const tracingBlocksState = (store: Store<MinaState>) => stateSliceAsPromise<TracingBlocksState>(store, condition, 'tracing', 'blocks');

describe('TRACING BLOCKS TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/tracing/blocks');
  });

  it('display tracing title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Tracing'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('blocks'));
  });

  it('display traces in the table', () => {
    cy.window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          expect(state.traces.length).above(1);
          cy.get('mina-tracing-blocks-table .mina-table')
            .get('.row:not(.head)')
            .should('have.length.above', 1);
        }
      });
  });

  it('by default, sort table by height descending', () => {
    cy.window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            if (state.traces[i].height < state.traces[i + 1].height) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by height ascending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(1)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            if (state.traces[i].height > state.traces[i + 1].height) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by global slot descending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            if (state.traces[i].globalSlot < state.traces[i + 1].globalSlot) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by hash descending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(3)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            const curr = state.traces[i].hash || '';
            const next = state.traces[i + 1].hash || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by creator descending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(4)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            const curr = state.traces[i].creator || '';
            const next = state.traces[i + 1].creator || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by total time ascending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(5)')
      .click()
      .get('mina-tracing-blocks-table .head > span:nth-child(5)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            if (state.traces[i].totalTime > state.traces[i + 1].totalTime) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by source descending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(6)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            const curr = state.traces[i].source || '';
            const next = state.traces[i + 1].source || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by status descending', () => {
    cy.get('mina-tracing-blocks-table .head > span:nth-child(7)')
      .click()
      .window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          let sorted = true;
          for (let i = 0; i < state.traces.length - 1; i++) {
            const curr = state.traces[i].status || '';
            const next = state.traces[i + 1].status || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('display correct color for status in the table', () => {
    cy.window()
      .its('store')
      .then(tracingBlocksState)
      .then((state: TracingBlocksState) => {
        if (state && state.traces.length > 1) {
          cy.get('mina-tracing-blocks-table .mina-table')
            .get('.row:not(.head) > span:nth-child(7)')
            .each((status, index: number) => {
              const clz = status.text();
              expect(status).to.have.class(clz);
              expect(clz).equals(state.traces[index].status);
            })
        }
      });
  });
});
