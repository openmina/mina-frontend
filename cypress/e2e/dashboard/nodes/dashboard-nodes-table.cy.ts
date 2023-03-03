import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getNodes, stateSliceAsPromise } from '../../../support/commands';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

const condition = (state: DashboardNodesState) => state && state.nodes.length > 1;
const getDashboard = (store: Store<MinaState>) => stateSliceAsPromise<DashboardNodesState>(store, condition, 'dashboard', 'nodes');

describe('DASHBOARD NODES TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/dashboard');
  });

  it('display dashboard title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Dashboard'));
  });

  it('display nodes in the table', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          expect(state.nodes.length).above(1);
          cy.get('mina-dashboard .mina-table')
            .get('.row')
            .should('have.length.above', 1);
        }
      });
  });

  it('by default, sort table by timestamp', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.nodes.length - 1; i++) {
            if (state.nodes[i].timestamp > state.nodes[i + 1].timestamp) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('have expected length of nodes', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          cy.window()
            .its('store')
            .then(getNodes)
            .then((nodes: MinaNode[]) => {
              const eachNodeHaveOneValue = state.nodes.every(n => state.nodes.filter(n1 => n1.url === n.url).length === 1);
              if (eachNodeHaveOneValue) {
                expect(state.nodes.length).to.eq(nodes.length);
              } else {
                expect(state.nodes.length).to.be.at.least(nodes.length);
              }
            });
        }
      });
  });

  it('open node in a new tab', () => {
    cy.wait(20000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          cy.get('.mina-table .row:first-child span:first-child a')
            .should('have.attr', 'href', state.nodes[0].url)
            .should('have.attr', 'target', '_blank');
        }
      });
  });

  it('calculate block latency correctly', () => {
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          function applyNewLatencies(nodes: DashboardNode[]): DashboardNode[] {
            if (nodes.length === 0) {
              return nodes;
            }
            const fastestTime = nodes.slice().sort((n1, n2) => n1.timestamp - n2.timestamp)[1].timestamp;
            return nodes.map(m => ({
              ...m,
              latency: !m.timestamp ? undefined : (m.timestamp - fastestTime) / ONE_THOUSAND,
            }));
          }

          const newNodes = applyNewLatencies(state.filteredNodes);

          state.filteredNodes.forEach((m: DashboardNode, i: number) => {
            expect(m.latency).to.equal(newNodes[i].latency);
          });
        }
      });
  });

  it('have correct number of counted nodes displayed', () => {
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          const syncedNodes = new Set(state.nodes.filter(n => n.name.includes('node')).map(n => n.url));
          const syncedProducers = new Set(state.nodes.filter(n => n.name.includes('prod')).map(n => n.url));
          const syncedSnarkers = new Set(state.nodes.filter(n => n.name.includes('snarker')).map(n => n.url));
          const syncedSeeders = new Set(state.nodes.filter(n => n.name.includes('seed')).map(n => n.url));
          const syncedTxGenerators = new Set(state.nodes.filter(n => n.name.includes('transaction-generator')).map(n => n.url));
          expect(syncedNodes.size).to.eq(state.nodeCount.nodes);
          expect(syncedProducers.size).to.eq(state.nodeCount.producers);
          expect(syncedSnarkers.size).to.eq(state.nodeCount.snarkers);
          expect(syncedSeeders.size).to.eq(state.nodeCount.seeders);
          expect(syncedTxGenerators.size).to.eq(state.nodeCount.transactionGenerators);
        }
      });
  });

  it('have correct number of counted filtered nodes displayed', () => {
    cy
      .get('mina-dashboard-nodes-toolbar .row1 div.flex-between div.flex-row button:last-child')
      .click({ force: true })
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          const syncedNodes = new Set(state.nodes.filter(n => n.name.includes('node') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
          const syncedProducers = new Set(state.nodes.filter(n => n.name.includes('prod') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
          const syncedSnarkers = new Set(state.nodes.filter(n => n.name.includes('snarker') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
          const syncedSeeders = new Set(state.nodes.filter(n => n.name.includes('seed') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
          const syncedTxGenerators = new Set(state.nodes.filter(n => n.name.includes('transaction-generator') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
          expect(syncedNodes.size).to.eq(state.nodeCount.nodes);
          expect(syncedProducers.size).to.eq(state.nodeCount.producers);
          expect(syncedSnarkers.size).to.eq(state.nodeCount.snarkers);
          expect(syncedSeeders.size).to.eq(state.nodeCount.seeders);
          expect(syncedTxGenerators.size).to.eq(state.nodeCount.transactionGenerators);
        }
      });
  });

  it('sort by name', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(1)')
      .click()
      .get('mina-dashboard-nodes-table .head > span:nth-child(1)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].name || '';
            const next = state.filteredNodes[i + 1].name || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by status', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].status || '';
            const next = state.filteredNodes[i + 1].status || '';
            if (next < curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by hash reversed', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(3)')
      .click()
      .get('mina-dashboard-nodes-table .head > span:nth-child(3)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].hash || '';
            const next = state.filteredNodes[i + 1].hash || '';
            if (next.localeCompare(curr) > 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by height', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(4)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].blockchainLength === undefined ? state.filteredNodes[i].blockchainLength : Number.MAX_VALUE;
            const next = state.filteredNodes[i + 1].blockchainLength === undefined ? state.filteredNodes[i + 1].blockchainLength : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by address', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(5)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].addr || '';
            const next = state.filteredNodes[i + 1].addr || '';
            if (next.localeCompare(curr) < 0) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by date', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(6)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].timestamp === undefined ? state.filteredNodes[i].timestamp : Number.MAX_VALUE;
            const next = state.filteredNodes[i + 1].timestamp === undefined ? state.filteredNodes[i + 1].timestamp : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by latency', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(7)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].latency === undefined ? state.filteredNodes[i].latency : Number.MAX_VALUE;
            const next = state.filteredNodes[i + 1].latency === undefined ? state.filteredNodes[i + 1].latency : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by block application', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(8)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].blockApplication === undefined ? state.filteredNodes[i].blockApplication : Number.MAX_VALUE;
            const next = state.filteredNodes[i + 1].blockApplication === undefined ? state.filteredNodes[i + 1].blockApplication : Number.MAX_VALUE;
            if (next < curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('sort by block block application reversed', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(8)')
      .click()
      .get('mina-dashboard-nodes-table .head > span:nth-child(8)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          let sorted = true;
          for (let i = 0; i < state.filteredNodes.length - 1; i++) {
            const curr = state.filteredNodes[i].blockApplication === undefined ? state.filteredNodes[i].blockApplication : Number.MAX_VALUE;
            const next = state.filteredNodes[i + 1].blockApplication === undefined ? state.filteredNodes[i + 1].blockApplication : Number.MAX_VALUE;
            if (next > curr) {
              sorted = false;
              break;
            }
          }
          expect(sorted).to.be.true;
        }
      });
  });

  it('open side panel', () => {
    cy.wait(5000)
      .get('mina-dashboard-nodes-table .head > span:nth-child(1)')
      .click()
      .get('mina-dashboard-nodes-table .row:not(.head)')
      .first()
      .click()
      .wait(1000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state && state.activeNode && state.filteredNodes[0].status === AppNodeStatusTypes.SYNCED) {
          expect(state.activeNode.url).to.eq(state.filteredNodes[0].url);
          expect(state.activeNode.hash).to.eq(state.filteredNodes[0].hash);
        }
      })
      .get('mina-dashboard-nodes-side-panel')
      .should('be.visible')
      .get('mina-block-structured-trace')
      .should('be.visible');
  });

  it('some nodes are online', () => {
    cy
      .wait(7000)
      .window()
      .its('store')
      .then(getDashboard)
      .then((state: DashboardNodesState) => {
        if (state) {
          expect(state.filteredNodes.some(n => n.status !== AppNodeStatusTypes.OFFLINE)).to.be.true;
        }
      });
  });
});
