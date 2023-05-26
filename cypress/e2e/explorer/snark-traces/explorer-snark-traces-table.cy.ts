import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { SnarkWorkersTracesState } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { SortDirection } from '@shared/types/shared/table-sort.type';
import { sort, truncateMid } from '../../../support/helpers';

const condition = (state: SnarkWorkersTracesState) => state && state.workers.length > 1;
const getSnarkTraces = (store: Store<MinaState>) => stateSliceAsPromise<SnarkWorkersTracesState>(store, condition, 'explorer', 'snarksTraces', 10000);

describe('EXPLORER SNARK TRACES TABLE', () => {
  it('display explorer title', () => {
    cy.visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Explorer'))
      .get('mina-submenu-tabs a.active')
      .then((a: any) => expect(a.text().toLowerCase()).equals('snark traces'));
  });

  it('display snark jobs in the table', () => {
    let jobs: string;
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = JSON.parse(body);
      })
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length > 1) {
          cy.get('.mina-table')
            .get('.row:not(.head)')
            .should('have.length.above', 1);
        }
      });
  });

  it('select snark trace', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .wait(2000)
      .get('mina-horizontal-resizable-container mina-snark-workers-side-panel > div span.mina-icon')
      .should('not.be.visible')
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          cy.get('.mina-table')
            .get('.row:not(.head)')
            .first()
            .click()
            .wait(500)
            .get('mina-horizontal-resizable-container mina-snark-workers-side-panel > div .times')
            .should('be.visible')
            .window()
            .its('store')
            .then(getSnarkTraces)
            .then((state: SnarkWorkersTracesState) => {
              if (state && jobs.length) {
                expect(state.activeRow.kind).to.equal(jobs[0].kind);
                expect(state.activeRow.worker).to.equal(jobs[0].worker);
                expect(state.activeRow.jobInit).to.equal(jobs[0].jobInit);
                cy.get('mina-snark-workers-side-panel > div .times > div:nth-child(1) > span:nth-child(2)')
                  .should('contain', jobs[0].kind)
                  .get('mina-snark-workers-side-panel > div .times > div:nth-child(2) > span:nth-child(2)')
                  .should('contain', state.workers[jobs[0].worker])
                  .log('')
                  .url()
                  .should('contain', `explorer/snark-traces/${jobs[0].id}`);
              }
            });
        }
      });
  });

  it('by default, sort table by job init', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
      })
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('jobInit');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by worker', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(1)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('worker');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by work ids', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(2)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('ids');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by kind', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(3)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('kind');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by job received', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(5)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('jobReceived');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by proof generated', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(6)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('proofGenerated');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

  it('sort table by proof submitted', () => {
    let jobs: SnarkWorkerTraceJob[];
    cy.intercept('GET', '/snarker-http-coordinator/worker-stats*')
      .as('getSnarkJobs')
      .visit(Cypress.config().baseUrl + '/explorer/snark-traces')
      .wait('@getSnarkJobs', { timeout: 50000 })
      .its('response.body')
      .then((body: string) => {
        jobs = mapTraces(JSON.parse(body));
        jobs = sort(jobs, { sortBy: 'jobInit', sortDirection: SortDirection.DSC }, ['ids', 'kind']);
      })
      .get('.mina-table .head > span:nth-child(7)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length) {
          expect(state.sort.sortBy).to.equal('proofSubmitted');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(truncateMid(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

});


function mapTraces(response: any): SnarkWorkerTraceJob[] {
  const workers: string[] = Object.keys(response);
  return workers.reduce((acc: SnarkWorkerTraceJob[], key: string, i: number) =>
      [
        ...acc,
        ...response[key].map((work: any, i2: number) => ({
          worker: i,
          kind: work.kind,
          ids: work.ids,
          id: acc.length + i2,
          jobInit: work.job_get_init_t,
          jobGetNodeReceived: work.job_get_node_received_t,
          jobGetNodeRequestWorkInit: work.job_get_node_request_work_init_t,
          jobGetNodeRequestWorkSuccess: work.job_get_node_request_work_success_t,
          jobGetSuccess: work.job_get_success_t,
          jobReceived: (work.job_get_success_t && work.job_get_init_t) ? (work.job_get_success_t - work.job_get_init_t) / ONE_THOUSAND : undefined,
          proofGenerated: (work.work_create_success_t && work.job_get_success_t) ? (work.work_create_success_t - work.job_get_success_t) / ONE_THOUSAND : undefined,
          workCreateSuccess: work.work_create_success_t,
          workSubmitNodeReceived: work.work_submit_node_received_t,
          workSubmitNodeAddWorkInit: work.work_submit_node_add_work_init_t,
          workSubmitNodeAddWorkSuccess: work.work_submit_node_add_work_success_t,
          workSubmitSuccess: work.work_submit_success_t,
          proofSubmitted: (work.work_submit_success_t && work.work_create_success_t) ? (work.work_submit_success_t - work.work_create_success_t) / ONE_THOUSAND : undefined,
        })),
      ],
    []);
}
