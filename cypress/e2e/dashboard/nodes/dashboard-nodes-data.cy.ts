import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import Bluebird from 'cypress/types/bluebird';
import AUTWindow = Cypress.AUTWindow;

describe('DASHBOARD NODES DATA CONSISTENCY', () => {
  it('counts consistency of data: 0 - 30', () => {
    const SLOTS_TO_CHECK = 30;
    type NodeStatsPerPage = {
      globalSlot: number;
      totalNodes: number;
      nodesMissingData: number;
      nodesWithRpcError: number;
    };
    const data: NodeStatsPerPage[] = [];
    let nodes: any[] = [];
    let maxGlobalSlot: number = 0;

    function findLatestGlobalSlot(index: number) {
      if (index >= nodes.length) {
        return Cypress.Promise.resolve();
      }

      return new Cypress.Promise((resolve) => {
        cy.request('POST', nodes[index].tracingUrl, { query: `query latestBlockHeight { blockTraces(maxLength: 1, order: Descending) }` })
          .then((response: any) => {
            maxGlobalSlot = Math.max(maxGlobalSlot, response.body.data.blockTraces.traces[0].global_slot);
            resolve(findLatestGlobalSlot(index + 1));
          });
      });
    }

    function checkNodesForGlobalSlot(index: number, globalSlot: number) {
      if (index >= nodes.length) {
        const dataIndex = data.findIndex(d => d.globalSlot === globalSlot);
        return cy.log(JSON.stringify(data[dataIndex], null, 2) + ',') as any;
      }
      return new Cypress.Promise((resolve) => {
        cy
          .request({
            method: 'POST',
            url: nodes[index].tracingUrl,
            body: { query: `query traces { blockTraces(global_slot: ${globalSlot}) }` },
            failOnStatusCode: false,
          })
          .then((response: Response) => {
            const dataIndex = data.findIndex(d => d.globalSlot === globalSlot);
            if (response.status !== 200) {
              data[dataIndex].nodesWithRpcError++;
            } else if ((response.body as any).data.blockTraces.traces.length === 0) {
              data[dataIndex].nodesMissingData++;
            }

            resolve(checkNodesForGlobalSlot(index + 1, globalSlot));
          });
      });
    }

    cy.visit(Cypress.config().baseUrl + '/tracing')
      .wait(1000)
      .window()
      .then((window: AUTWindow) => {
        const nodeLister = (window as any).config.nodeLister;
        if (!nodeLister) return;

        cy.log('[')
          .request('GET', nodeLister.domain + ':' + nodeLister.port + '/nodes')
          .then((response: any) => {

            nodes = response.body.map((node: any) => ({
              name: `${node.ip}:${node.graphql_port}`,
              url: `${node.ip}:${node.graphql_port}/graphql`,
              tracingUrl: `${nodeLister.domain}:${node.internal_trace_port}/graphql`,
              status: AppNodeStatusTypes.SYNCED,
            }));

            let globalSlotPromises: Bluebird<any>[] = [];
            findLatestGlobalSlot(0)
              .then(() => {
                for (let i = 0; i < SLOTS_TO_CHECK; i++) {
                  const newGlobalSlot = maxGlobalSlot - i;
                  data.push({
                    globalSlot: newGlobalSlot,
                    totalNodes: nodes.length,
                    nodesWithRpcError: 0,
                    nodesMissingData: 0,
                  });
                  globalSlotPromises.push(checkNodesForGlobalSlot(0, newGlobalSlot));
                }

                return cy
                  .wrap(Promise.all(globalSlotPromises))
                  .log(']');
              });
          });
      })
      .then(() => expect(data.length).to.eq(SLOTS_TO_CHECK));
  });
  it('counts consistency of data: 30 - 60', () => {
    const SLOTS_TO_CHECK = 30;
    type NodeStatsPerPage = {
      globalSlot: number;
      totalNodes: number;
      nodesMissingData: number;
      nodesWithRpcError: number;
    };
    const data: NodeStatsPerPage[] = [];
    let nodes: any[] = [];
    let maxGlobalSlot: number = 0;

    function findLatestGlobalSlot(index: number) {
      if (index >= nodes.length) {
        return Cypress.Promise.resolve();
      }

      return new Cypress.Promise((resolve) => {
        cy.request('POST', nodes[index].tracingUrl, { query: `query latestBlockHeight { blockTraces(maxLength: 1, order: Descending) }` })
          .then((response: any) => {
            maxGlobalSlot = Math.max(maxGlobalSlot, response.body.data.blockTraces.traces[0].global_slot);
            resolve(findLatestGlobalSlot(index + 1));
          });
      });
    }

    function checkNodesForGlobalSlot(index: number, globalSlot: number) {
      if (index >= nodes.length) {
        const dataIndex = data.findIndex(d => d.globalSlot === globalSlot);
        return cy.log(JSON.stringify(data[dataIndex], null, 2) + ',') as any;
      }
      return new Cypress.Promise((resolve) => {
        cy
          .request({
            method: 'POST',
            url: nodes[index].tracingUrl,
            body: { query: `query traces { blockTraces(global_slot: ${globalSlot}) }` },
            failOnStatusCode: false,
          })
          .then((response: Response) => {
            const dataIndex = data.findIndex(d => d.globalSlot === globalSlot);
            if (response.status !== 200) {
              data[dataIndex].nodesWithRpcError++;
            } else if ((response.body as any).data.blockTraces.traces.length === 0) {
              data[dataIndex].nodesMissingData++;
            }

            resolve(checkNodesForGlobalSlot(index + 1, globalSlot));
          });
      });
    }

    cy.visit(Cypress.config().baseUrl + '/tracing')
      .wait(1000)
      .window()
      .then((window: AUTWindow) => {
        const nodeLister = (window as any).config.nodeLister;
        if (!nodeLister) return;

        cy.log('[')
          .request('GET', nodeLister.domain + ':' + nodeLister.port + '/nodes')
          .then((response: any) => {

            nodes = response.body.map((node: any) => ({
              name: `${node.ip}:${node.graphql_port}`,
              url: `${node.ip}:${node.graphql_port}/graphql`,
              tracingUrl: `${nodeLister.domain}:${node.internal_trace_port}/graphql`,
              status: AppNodeStatusTypes.SYNCED,
            }));

            let globalSlotPromises: Bluebird<any>[] = [];
            findLatestGlobalSlot(0)
              .then(() => {
                maxGlobalSlot -= 30;
                for (let i = 0; i < SLOTS_TO_CHECK; i++) {
                  const newGlobalSlot = maxGlobalSlot - i;
                  data.push({
                    globalSlot: newGlobalSlot,
                    totalNodes: nodes.length,
                    nodesWithRpcError: 0,
                    nodesMissingData: 0,
                  });
                  globalSlotPromises.push(checkNodesForGlobalSlot(0, newGlobalSlot));
                }

                return cy
                  .wrap(Promise.all(globalSlotPromises))
                  .log(']');
              });
          });
      })
      .then(() => expect(data.length).to.eq(SLOTS_TO_CHECK));
  });

});

