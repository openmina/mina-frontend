import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { SnarkWorkersTracesState } from '@explorer/snark-workers-traces/snark-workers-traces.state';
import { SnarkWorkerTraceJob } from '@shared/types/explorer/snark-traces/snark-worker-trace-job.type';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { hasValue } from '@shared/helpers/values.helper';

const condition = (state: SnarkWorkersTracesState) => state && state.workers.length > 1;
const getSnarkTraces = (store: Store<MinaState>) => stateSliceAsPromise<SnarkWorkersTracesState>(store, condition, 'explorer', 'snarksTraces', 10000);

describe('EXPLORER SNARK TRACES TABLE', () => {
  beforeEach(() => {
    // cy.visit(Cypress.config().baseUrl + '/explorer/snark-traces');
  });

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
        if (state && jobs) {
          cy.get('.mina-table')
            .get('.row:not(.head)')
            .should('have.length.above', 1);
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
        if (state && jobs) {
          expect(state.sort.sortBy).to.equal('jobInit');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(transform(state.workers[jobs[i].worker], 0, 12));
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
      })
      .get('.mina-table .head > span:nth-child(1)')
      .click()
      .wait(2000)
      .window()
      .its('store')
      .then(getSnarkTraces)
      .then((state: SnarkWorkersTracesState) => {
        if (state && jobs) {
          expect(state.sort.sortBy).to.equal('worker');
          jobs = sort(jobs, state.sort, ['ids', 'kind']);
          cy.get('.mina-table')
            .get('.row:not(.head) > span:nth-child(1)')
            .then((spans: any) => {
              Array.from(spans).forEach((span: any, i: number) => {
                expect(span.innerText).to.equal(transform(state.workers[jobs[i].worker], 0, 12));
              });
            });
        }
      });
  });

});

function transform(value: string, firstSlice: number = 6, secondSlice: number = 6): string {
  if (!value) {
    return '';
  }
  return value.length > (firstSlice + secondSlice) ? value.slice(0, firstSlice) + '...' + value.slice(value.length - secondSlice) : value;
}

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

function removeLast<T>(arr: T[]): T[] {
  return arr.slice(0, arr.length - 1);
}


function sort<T = any>(inpArray: T[], sort: TableSort<T>, strings: Array<keyof T>, sortNulls: boolean = false): T[] {
  const sortProperty = sort.sortBy;
  const isStringSorting = strings.includes(sortProperty);
  const array: T[] = [...inpArray];

  let toBeSorted: T[];
  let toNotBeSorted: T[] = [];
  if (sortNulls) {
    toBeSorted = array;
  } else {
    toBeSorted = isStringSorting ? array : array.filter(e => e[sortProperty] !== undefined && e[sortProperty] !== null);
    toNotBeSorted = isStringSorting ? [] : array.filter(e => e[sortProperty] === undefined || e[sortProperty] === null);
  }

  if (isStringSorting) {
    const stringSort = (o1: T, o2: T) => {
      const s2 = (o2[sortProperty] || '') as string;
      const s1 = (o1[sortProperty] || '') as string;
      return sort.sortDirection === SortDirection.DSC
        ? (s2).localeCompare(s1)
        : s1.localeCompare(s2);
    };
    toBeSorted.sort(stringSort);
  } else {
    const numberSort = (o1: T, o2: T): number => {
      const o2Sort = (hasValue(o2[sortProperty]) ? o2[sortProperty] : Number.MAX_VALUE) as number;
      const o1Sort = (hasValue(o1[sortProperty]) ? o1[sortProperty] : Number.MAX_VALUE) as number;
      return sort.sortDirection === SortDirection.DSC
        ? o2Sort - o1Sort
        : o1Sort - o2Sort;
    };
    toBeSorted.sort(numberSort);
  }

  return [...toBeSorted, ...toNotBeSorted];
}
