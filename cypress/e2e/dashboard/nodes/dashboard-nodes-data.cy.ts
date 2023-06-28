import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { stateSliceAsPromise } from '../../../support/commands';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';

const condition = (state: DashboardNodesState) => state && state.nodes.length > 1;
const getDashboard = (store: Store<MinaState>) => stateSliceAsPromise<DashboardNodesState>(store, condition, 'dashboard', 'nodes');

describe('DASHBOARD NODES TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/dashboard');
  });

  it('counts consistency of data', () => {
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
            .then((el: any) => {
              if (el.hasClass('disabled')) {
                cy.log('Frontend asked for global slot ' + data[data.length - 1].globalSlot + ' but it was not available.');
                cy.log(JSON.stringify(data, null, 2));
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
            });
        }

        checkSlots(slotsToCheck);
      });
  });

});
