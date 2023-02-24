import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { getActiveNode, getNodes, PROMISE, storeDashboardSubscription } from '../../../support/commands';
import { ONE_THOUSAND } from '@shared/constants/unit-measurements';
import { DashboardNodesState } from '@dashboard/nodes/dashboard-nodes.state';
import { DashboardNode } from '@shared/types/dashboard/node-list/dashboard-node.type';
import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

const getDashboard = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (dashboard: DashboardNodesState) => {
      if (dashboard.nodes.length > 1) {
        return resolve(dashboard);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeDashboardSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

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
      .then((dashboard: DashboardNodesState) => {
        expect(dashboard.nodes.length).above(1);
        cy.get('mina-dashboard .mina-table')
          .get('.row')
          .should('have.length.above', 1);
      });
  });

  it('by default, sort table by timestamp', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.nodes.length - 1; i++) {
          if (dashboard.nodes[i].timestamp > dashboard.nodes[i + 1].timestamp) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('have expected length of nodes', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        cy.window()
          .its('store')
          .then(getNodes)
          .then((nodes: MinaNode[]) => {
            const eachNodeHaveOneValue = dashboard.nodes.every(n => dashboard.nodes.filter(n1 => n1.url === n.url).length === 1);
            if (eachNodeHaveOneValue) {
              expect(dashboard.nodes.length).to.eq(nodes.length);
            } else {
              expect(dashboard.nodes.length).to.be.at.least(nodes.length);
            }
          });
      });
  });

  it('open node in a new tab', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        cy.get('.mina-table .row:first-child span:first-child a')
          .should('have.attr', 'target', '_blank')
          .invoke('removeAttr', 'target')
          .click()
          .url()
          .should('equal', dashboard.nodes[0].url);
      });
  });

  it('calculate block latency correctly', () => {
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {

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

        const newNodes = applyNewLatencies(dashboard.filteredNodes);

        dashboard.filteredNodes.forEach((m: DashboardNode, i: number) => {
          expect(m.latency).to.equal(newNodes[i].latency);
        });
      });
  });

  it('have correct number of counted nodes displayed', () => {
    cy
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        const syncedNodes = new Set(dashboard.nodes.filter(n => n.name.includes('node')).map(n => n.url));
        const syncedProducers = new Set(dashboard.nodes.filter(n => n.name.includes('prod')).map(n => n.url));
        const syncedSnarkers = new Set(dashboard.nodes.filter(n => n.name.includes('snarker')).map(n => n.url));
        const syncedSeeders = new Set(dashboard.nodes.filter(n => n.name.includes('seed')).map(n => n.url));
        const syncedTxGenerators = new Set(dashboard.nodes.filter(n => n.name.includes('transaction-generator')).map(n => n.url));
        expect(syncedNodes.size).to.eq(dashboard.nodeCount.nodes);
        expect(syncedProducers.size).to.eq(dashboard.nodeCount.producers);
        expect(syncedSnarkers.size).to.eq(dashboard.nodeCount.snarkers);
        expect(syncedSeeders.size).to.eq(dashboard.nodeCount.seeders);
        expect(syncedTxGenerators.size).to.eq(dashboard.nodeCount.transactionGenerators);
      });
  });

// it('have correct number of counted filtered nodes displayed', () => {
//   cy
//     .get('mina-dashboard-nodes-toolbar .row1 div.flex-between div.flex-row button:last-child')
//     .click()
//     .window()
//     .its('store')
//     .then(getDashboard)
//     .then((dashboard: DashboardNodesState) => {
//       const syncedNodes = new Set(dashboard.nodes.filter(n => n.name.includes('node') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
//       const syncedProducers = new Set(dashboard.nodes.filter(n => n.name.includes('prod') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
//       const syncedSnarkers = new Set(dashboard.nodes.filter(n => n.name.includes('snarker') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
//       const syncedSeeders = new Set(dashboard.nodes.filter(n => n.name.includes('seed') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
//       const syncedTxGenerators = new Set(dashboard.nodes.filter(n => n.name.includes('transaction-generator') && n.status !== AppNodeStatusTypes.OFFLINE).map(n => n.url));
//       expect(syncedNodes.size).to.eq(dashboard.nodeCount.nodes);
//       expect(syncedProducers.size).to.eq(dashboard.nodeCount.producers);
//       expect(syncedSnarkers.size).to.eq(dashboard.nodeCount.snarkers);
//       expect(syncedSeeders.size).to.eq(dashboard.nodeCount.seeders);
//       expect(syncedTxGenerators.size).to.eq(dashboard.nodeCount.transactionGenerators);
//     });
// });

  it('sort by name', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(1)')
      .click()
      .get('mina-dashboard-nodes-table .head > span:nth-child(1)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].name || '';
          const next = dashboard.filteredNodes[i + 1].name || '';
          if (next.localeCompare(curr) > 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by status', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].status || '';
          const next = dashboard.filteredNodes[i + 1].status || '';
          if (next < curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
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
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].hash || '';
          const next = dashboard.filteredNodes[i + 1].hash || '';
          if (next.localeCompare(curr) > 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by height', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(4)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].blockchainLength === undefined ? dashboard.filteredNodes[i].blockchainLength : Number.MAX_VALUE;
          const next = dashboard.filteredNodes[i + 1].blockchainLength === undefined ? dashboard.filteredNodes[i + 1].blockchainLength : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by address', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(5)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].addr || '';
          const next = dashboard.filteredNodes[i + 1].addr || '';
          if (next.localeCompare(curr) < 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by date', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(6)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].timestamp === undefined ? dashboard.filteredNodes[i].timestamp : Number.MAX_VALUE;
          const next = dashboard.filteredNodes[i + 1].timestamp === undefined ? dashboard.filteredNodes[i + 1].timestamp : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by latency', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(7)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].latency === undefined ? dashboard.filteredNodes[i].latency : Number.MAX_VALUE;
          const next = dashboard.filteredNodes[i + 1].latency === undefined ? dashboard.filteredNodes[i + 1].latency : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by block application', () => {
    cy
      .get('mina-dashboard-nodes-table .head > span:nth-child(8)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].blockApplication === undefined ? dashboard.filteredNodes[i].blockApplication : Number.MAX_VALUE;
          const next = dashboard.filteredNodes[i + 1].blockApplication === undefined ? dashboard.filteredNodes[i + 1].blockApplication : Number.MAX_VALUE;
          if (next < curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
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
      .then((dashboard: DashboardNodesState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredNodes.length - 1; i++) {
          const curr = dashboard.filteredNodes[i].blockApplication === undefined ? dashboard.filteredNodes[i].blockApplication : Number.MAX_VALUE;
          const next = dashboard.filteredNodes[i + 1].blockApplication === undefined ? dashboard.filteredNodes[i + 1].blockApplication : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('open side panel', () => {
    cy
      .wait(5000)
      .get('mina-dashboard-nodes-table .row:not(.head)')
      .first()
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: DashboardNodesState) => {
        expect(dashboard.activeNode.url).to.eq(dashboard.filteredNodes[0].url);
        expect(dashboard.activeNode.hash).to.eq(dashboard.filteredNodes[0].hash);
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
      .then((dashboard: DashboardNodesState) => {
        expect(dashboard.filteredNodes.some(n => n.status !== AppNodeStatusTypes.OFFLINE)).to.be.true;
      })
  });
});
