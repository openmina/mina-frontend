import { AppNodeStatusTypes } from '@shared/types/app/app-node-status-types.enum';
import Bluebird from 'cypress/types/bluebird';
import AUTWindow = Cypress.AUTWindow;
import { last } from 'rxjs';

let lastTestedGlobalSlot = 0;
const SLOTS_PER_TEST = 10;

type NodeStatsPerPage = {
  globalSlot: number;
  totalNodes: number;
  nodesMissingData: number;
  nodesWithRpcError: number;
};

function findLatestGlobalSlot(index: number, knownMaxGlobalSlot: number, nodes: any[]): Bluebird<number> {
  if (lastTestedGlobalSlot !== 0) {
    return Cypress.Promise.resolve(lastTestedGlobalSlot - 1);
  }
  if (index >= nodes.length) {
    return Cypress.Promise.resolve(knownMaxGlobalSlot);
  }

  return new Cypress.Promise((resolve) => {
    cy.request('POST', nodes[index].tracingUrl, { query: `query latestBlockHeight { blockTraces(maxLength: 1, order: Descending) }` })
      .then((response: any) => {
        const newGlobalSlot = Math.max(knownMaxGlobalSlot, response.body.data.blockTraces.traces[0].global_slot);
        resolve(findLatestGlobalSlot(index + 1, newGlobalSlot, nodes));
      });
  });
}

function checkNodesForGlobalSlot(index: number, globalSlot: number, nodes: any[], data: NodeStatsPerPage[]): Bluebird<any> {
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

        resolve(checkNodesForGlobalSlot(index + 1, globalSlot, nodes, data));
      });
  });
}

function mapNodesFromHttpResponse(response: any, nodeLister: { domain: string; port: number; }): any[] {
  return response.body
    // .slice(0, 5)
    .map((node: any) => ({
      name: `${node.ip}:${node.graphql_port}`,
      url: `${node.ip}:${node.graphql_port}/graphql`,
      tracingUrl: `${nodeLister.domain}:${node.internal_trace_port}/graphql`,
      status: AppNodeStatusTypes.SYNCED,
    }));
}

describe('DASHBOARD NODES DATA CONSISTENCY', () => {
  it('counts consistency of data - slice 1', test);
  it('counts consistency of data - slice 2', test);
  it('counts consistency of data - slice 3', test);
  it('counts consistency of data - slice 4', test);
});


function test(): void {
  const data: NodeStatsPerPage[] = [];
  let nodes: any[] = [];
  let maxGlobalSlot: number = 0;

  cy.visit(Cypress.config().baseUrl + '/tracing')
    .wait(1000)
    .window()
    .then((window: AUTWindow) => {
      const nodeLister = (window as any).config.nodeLister;
      if (!nodeLister) return;

      cy.log('[')
        .request('GET', nodeLister.domain + ':' + nodeLister.port + '/nodes')
        .then((response: any) => {
          nodes = mapNodesFromHttpResponse(response, nodeLister);

          let globalSlotPromises: Bluebird<any>[] = [];
          findLatestGlobalSlot(0, 0, nodes)
            .then((foundMaxGlobalSlot: number) => {
              maxGlobalSlot = foundMaxGlobalSlot;
              for (let i = 0; i < SLOTS_PER_TEST; i++) {
                const newGlobalSlot = maxGlobalSlot - i;
                data.push({
                  globalSlot: newGlobalSlot,
                  totalNodes: nodes.length,
                  nodesWithRpcError: 0,
                  nodesMissingData: 0,
                });
                globalSlotPromises.push(checkNodesForGlobalSlot(0, newGlobalSlot, nodes, data));
              }

              return cy
                .wrap(Promise.all(globalSlotPromises))
                .log(']')
                .then(() => {
                  lastTestedGlobalSlot = data[data.length - 1].globalSlot;
                });
            });
        });
    })
    .then(() => expect(data.length).to.eq(SLOTS_PER_TEST));
}