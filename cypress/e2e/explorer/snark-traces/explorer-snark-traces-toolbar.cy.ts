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

describe('EXPLORER SNARK TRACES TOOLBAR', () => {
  it('show all workers', () => {
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
      .wait(1000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length > 1) {
          expect(state.filter.workers.length).to.equal(0);
          cy.get('mina-snark-workers-toolbar > div > button:nth-child(1)')
            .should('have.class', 'btn-selected')
            .get('mina-snark-workers-toolbar > div > button:nth-child(2)')
            .should('not.have.class', 'btn-selected');
        }
      });
  });

  it.only('select multiple workers', () => {
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
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length > 1 && state.workers.length > 1) {
          expect(state.filter.workers.length).to.equal(0);
          cy.get('mina-snark-workers-toolbar > div > button:nth-child(2)')
            .click()
            .wait(400)
            .get('body .cdk-overlay-container .monospace > div:nth-child(1)')
            .should('not.have.class', 'active')
            .click()
            .wait(500)
            .get('body .cdk-overlay-container .monospace > div:nth-child(1)')
            .should('have.class', 'active')
            .get('body .cdk-overlay-container .monospace > div:nth-child(2)')
            .should('not.have.class', 'active')
            .click()
            .wait(500)
            .get('body .cdk-overlay-container .monospace > div:nth-child(2)')
            .should('have.class', 'active')
            .wait(1000)
            .get('.mina-table')
            .click()
            .wait(500)
            .window()
            .its('store')
            .then(getSnarkTraces)
            .then((state2: SnarkWorkersTracesState) => {
              if (state2) {
                expect(state2.filter.workers.length).to.equal(2);
                expect(state2.filter.workers[0]).to.equal(state2.workers[0]);
                expect(state2.filter.workers[1]).to.equal(state2.workers[1]);
                cy.get('.mina-table .row:not(.head) > span:nth-child(1)')
                  .then((spans: any) => {
                    Array.from(spans).forEach((span: any) => {
                      expect(span.innerText).to.be.oneOf([truncateMid(state.workers[0], 0, 12), truncateMid(state.workers[1], 0, 12)]);
                    });
                  });
              }
            });
        }
      });
  });

  it('set 1m interval in interval picker component', () => {
    const date = new Date();
    const yearNow = date.getFullYear();
    const monthNow = date.getMonth() + 1;
    const dayNow = date.getDate();
    const hourNow = date.getHours();
    const minuteNow = date.getMinutes();
    let secondNow: number;
    const dateOneMinuteAgo = new Date(Date.now() - 60000);
    const yearOneMinuteAgo = dateOneMinuteAgo.getFullYear();
    const monthOneMinuteAgo = dateOneMinuteAgo.getMonth() + 1;
    const dayOneMinuteAgo = dateOneMinuteAgo.getDate();
    const hoursOneMinuteAgo = dateOneMinuteAgo.getHours();
    const minutesOneMinuteAgo = dateOneMinuteAgo.getMinutes();
    let secondsOneMinuteAgo: number;
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
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length > 1 && state.workers.length > 1) {
          cy.get('mina-snark-workers-toolbar > div > button:nth-child(4)')
            .click()
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(1) button:nth-child(2)')
            .click()
            .then(() => secondsOneMinuteAgo = new Date(Date.now() - 60000).getSeconds())
            .then(() => secondNow = new Date().getSeconds())
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(5)')
            .should('have.value', yearOneMinuteAgo)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(6)')
            .should('have.value', monthOneMinuteAgo)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(7)')
            .should('have.value', dayOneMinuteAgo)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(2)')
            .should('have.value', hoursOneMinuteAgo)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(3)')
            .should('have.value', minutesOneMinuteAgo)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(2) form input:nth-child(4)')
            .invoke('val')
            .then((value: string) => {
              expect(value).to.equal(secondsOneMinuteAgo.toString());
            })
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(5)')
            .should('have.value', yearNow)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(6)')
            .should('have.value', monthNow)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(7)')
            .should('have.value', dayNow)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(2)')
            .should('have.value', hourNow)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(3)')
            .should('have.value', minuteNow)
            .get('.cdk-overlay-container mina-interval-select .container div:nth-child(3) form input:nth-child(4)')
            .invoke('val')
            .then((value: string) => {
              expect(value).to.equal(secondNow.toString());
            })
            .get('.cdk-overlay-container mina-interval-select > div > div:nth-child(4) button:nth-child(2)')
            .click()
            .wait(1000)
            .get('mina-snark-workers-toolbar > div > button:nth-child(4)')
            .should('contain.text', '' + hoursOneMinuteAgo + ':' + minutesOneMinuteAgo)
            .should('contain.text', '' + hourNow + ':' + minuteNow);
        }
      });
  });

  it('show count of workers and jobs', () => {
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
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs.length > 1 && state.workers.length > 1) {
          cy.get('mina-snark-workers-toolbar > div.tertiary:nth-child(2)')
            .then((div: any) => {
              expect(div[0].innerText).to.include(state.workers.length + ' workers');
              expect(div[0].innerText).to.include(jobs.length + ' jobs');
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
