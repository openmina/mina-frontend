import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import AUTWindow = Cypress.AUTWindow;

const condition = (state: DashboardNodesState) => state && state.nodes.length > 1;
const getDashboard = (store: Store<MinaState>) => stateSliceAsPromise<DashboardNodesState>(store, condition, 'dashboard', 'nodes');

describe('DASHBOARD NODES DATA CONSISTENCY', () => {
  // beforeEach(() => {
  //   cy.visit(Cypress.config().baseUrl + '/dashboard');
  // });

  it('counts consistency of data', () => {
    cy.visit(Cypress.config().baseUrl + '/dashboard');
    cy.wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        const SLOTS_TO_CHECK = 10;
        const slotsToCheck = (state && state.activeBlock > SLOTS_TO_CHECK) ? SLOTS_TO_CHECK : state.activeBlock - 1;
        type NodeStatsPerPage = {
          globalSlot: number;
          totalNodes: number;
          nodesMissingData: number;
          nodesWithRpcError: number;
        };
        const data: NodeStatsPerPage[] = [];

        function checkSlots(count: number) {
          if (count <= 0) {
            return;
          }
          cy.get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child')
            .click({ force: true, timeout: 60000 })
            .wait(1000)
            .window()
            .its('store')
            .then(getDashboard)
            .then((state: DashboardNodesState) => {
              const statsOfThisPage: NodeStatsPerPage = {
                globalSlot: state.activeBlock,
                totalNodes: state.nodes.length,
                nodesWithRpcError: state.nodes.filter(n => n.status === AppNodeStatusTypes.OFFLINE).length,
                nodesMissingData: state.nodes.filter(n => !n.blockchainLength).length,
              };
              data.push(statsOfThisPage);
              if (count === 1) {
                cy.log(JSON.stringify(data, null, 2));
                expect(data.length).to.eq(SLOTS_TO_CHECK);
              }
              checkSlots(count - 1);
            });
        }

        checkSlots(slotsToCheck);
      });
  });

  it.only('counts consistency of data 2', () => {
    const SLOTS_TO_CHECK = 10;
    type NodeStatsPerPage = {
      globalSlot: number;
      totalNodes: number;
      nodesMissingData: number;
      nodesWithRpcError: number;
    };
    const data: NodeStatsPerPage[] = [];
    let initialSlot: number;

    cy.visit(Cypress.config().baseUrl + '/tracing')
      .wait(1000)
      .window()
      .then((window: AUTWindow) => {
        const nodeLister = (window as any).config.nodeLister;
        if (!nodeLister) return;

        let nodes: any[] = [];
        let maxGlobalSlot: number = 0;

        cy.request('GET', nodeLister.domain + ':' + nodeLister.port + '/nodes')
          .then((response: any) => {
            nodes = response.body.slice(0, 10).map((node: any) => {
              return ({
                ...{} as any,
                name: `${node.ip}:${node.graphql_port}`,
                url: `${node.ip}:${node.graphql_port}/graphql`,
                tracingUrl: `${nodeLister.domain}:${node.internal_trace_port}/graphql`,
                status: AppNodeStatusTypes.SYNCED,
                forks: [],
              });
            });
            console.log(nodes);
            expect(nodes).to.have.length(10);
          });

        cy.wrap(nodes).each((node: any) => {
          return new Cypress.Promise((resolve) => {
            console.log(node);
            // cy.request('POST', node.url, { query: `query latestBlockHeight { blockTraces(maxLength: 1, order: Descending) }` })
            //   .then((response: any) => {
            //     maxGlobalSlot = Math.max(maxGlobalSlot, response.body.data.blockTraces.traces[0].global_slot);
            //     console.log('maxGlobalSlot', maxGlobalSlot);
            //   });
          });
        });
      });

  });

  // it.only('counts consistency of data 3', () => {
  //   const SLOTS_TO_CHECK = 2;
  //   type NodeStatsPerPage = {
  //     globalSlot: number;
  //     totalNodes: number;
  //     nodesMissingData: number;
  //     nodesWithRpcError: number;
  //   };
  //   const data: NodeStatsPerPage[] = [];
  //
  //   const storeCb = (store: Store<MinaState>) => {
  //     let initialSlot: number;
  //
  //     store
  //       .pipe(
  //         map((state: MinaState) => state.dashboard.nodes),
  //         filter((state: DashboardNodesState) => state.remainingOngoingRequests === 0),
  //         debounceTime(1000),
  //       )
  //       .subscribe((state: DashboardNodesState) => {
  //         if (!initialSlot) {
  //           initialSlot = state.activeBlock;
  //         }
  //
  //         const statsOfThisPage: NodeStatsPerPage = {
  //           globalSlot: state.activeBlock,
  //           totalNodes: state.nodes.length,
  //           nodesWithRpcError: state.nodes.filter((n) => n.status === AppNodeStatusTypes.OFFLINE).length,
  //           nodesMissingData: state.nodes.filter((n) => !n.blockchainLength).length,
  //         };
  //         data.push(statsOfThisPage);
  //         console.log('exiting block ' + state.activeBlock);
  //       });
  //   };
  //
  //   cy
  //     .wait(1000).window().its('store').then(storeCb)
  //     .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child').click({ force: true })
  //     .wait(1000).window().its('store').then(storeCb)
  //     .get('mina-dashboard-nodes-toolbar > div:first-child .pagination-group button:first-child').click({ force: true })
  //     .then(() => {
  //       cy.log(JSON.stringify(data, null, 2));
  //       expect(data.length).to.eq(SLOTS_TO_CHECK);
  //     });
  // });
  //

});

