import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { PROMISE, storeDashboardSubscription } from '../../support/commands';
import { AggregatorState } from '@dashboard/aggregator/aggregator.state';
import { DashboardMessage } from '@shared/types/dashboard/dashboard-message';
import { ONE_MILLION, ONE_THOUSAND } from '@shared/constants/unit-measurements';

const getDashboard = (store: Store<MinaState>) => {
  const promiseBody = (resolve: (result?: unknown) => void): void => {
    const observer = (dashboard: AggregatorState) => {
      if (dashboard.messages.length > 2) {
        return resolve(dashboard);
      }
      setTimeout(() => resolve(), 3000);
    };
    storeDashboardSubscription(store, observer);
  };
  return PROMISE(promiseBody);
};

describe('DASHBOARD TABLE', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl') + '/dashboard');
  });

  it('displays dashboard title', () => {
    cy.get('mina-toolbar span')
      .then((span: any) => expect(span).contain('Dashboard'));
  });

  it('displays messages in the table', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        expect(dashboard.messages.length).above(20);
        cy.get('mina-dashboard .mina-table')
          .get('.row')
          .should('have.length.above', 2);
      });
  });

  it('by default, sort table by timestamp', () => {
    cy.window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.messages.length - 1; i++) {
          if (dashboard.messages[i].timestamp > dashboard.messages[i + 1].timestamp) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('date is created correctly', () => {
    let response: any[];
    cy
      .intercept('/aggregator/block/*', (req) => {
        req.continue((res) => {
          response = res.body[1].reduce((acc: any[], curr: any) => [...acc, ...curr.events.map((m: any) => ({
            ...m,
            timestamp: m.receiving_time_microseconds || -1,
          }))], []);
        });
      })
      .as('getMessages')
      .wait('@getMessages', { timeout: 10000 })
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        response = response.sort((a: any, b: any) => a.timestamp - b.timestamp);
        const messages = dashboard.messages;

        response.forEach((m: any, i: number) => {
          const httpResponse = m.receiving_time_microseconds ? Math.floor(m.receiving_time_microseconds / ONE_THOUSAND) : undefined;
          const frontendValue = m.receiving_time_microseconds ? Date.parse(messages[i].date) : undefined;
          expect(httpResponse).to.equal(frontendValue);
        });
      });
  });

  it('block latency is created correctly', () => {
    let response: any[];
    cy
      .intercept('/aggregator/block/*', (req) => {
        req.continue((res) => {
          response = res.body[1].reduce((acc: any[], curr: any) => [...acc, ...curr.events.map((m: any) => ({
            ...m,
            sentMessageId: m.sent_message_id,
            receivedMessageId: m.received_message_id,
            timestamp: m.receiving_time_microseconds || -1,
          }))], []);
        });
      })
      .as('getMessages')
      .wait('@getMessages', { timeout: 10000 })
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        response = response.sort((a: any, b: any) => a.timestamp - b.timestamp);
        const messages = dashboard.messages;

        const fastestTime = Math.min(...response.filter(m => m.timestamp !== -1).map(m => m.timestamp));
        messages.forEach((m: DashboardMessage, i: number) => {
          if (i < messages.length - 1 && m.blockLatency !== messages[i + 1].blockLatency) {
            const expectedLatency = response[i].timestamp === -1 ? undefined : (response[i].timestamp - fastestTime) / ONE_MILLION;
            expect(expectedLatency).to.equal(messages[i].blockLatency);
            if (messages[i + 1].blockLatency && m.blockLatency) {
              expect(messages[i + 1].blockLatency).to.be.greaterThan(m.blockLatency);
            }
          }
        });
      });
  });

  it('block latency is created correctly after filtering', () => {
    let response: any[];
    let filterStart: string;
    cy
      .intercept('/aggregator/block/*', (req) => {
        req.continue((res) => {
          response = res.body[1].reduce((acc: any[], curr: any) => [...acc, ...curr.events.map((m: any) => ({
            ...m,
            timestamp: m.receiving_time_microseconds || -1,
          }))], []);
        });
      })
      .as('getMessages')
      .wait('@getMessages', { timeout: 10000 })
      .get('mina-dashboard-toolbar > div:last-child button:nth-child(2)')
      .then((elem: any) => {
        filterStart = elem.text().split('...')[0];
      })
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        const sortFunc = (a: any, b: any) => a.timestamp - b.timestamp;
        response = response.filter(r => r.hash.startsWith(filterStart));
        response = response.sort(sortFunc);
        const messages = dashboard.filteredMessages.slice().sort(sortFunc);

        const fastestTime = Math.min(...response.filter(m => m.timestamp !== -1).map(m => m.timestamp));
        messages.forEach((m: DashboardMessage, i: number) => {
          if (i < messages.length - 1 && m.blockLatency !== messages[i + 1].blockLatency) {
            const expectedLatency = response[i].timestamp === -1 ? undefined : (response[i].timestamp - fastestTime) / ONE_MILLION;
            expect(expectedLatency).to.equal(messages[i].blockLatency);
            if (messages[i + 1].blockLatency && m.blockLatency) {
              expect(messages[i + 1].blockLatency).to.be.greaterThan(m.blockLatency);
            }
          }
        });
      });
  });

  it('sort by received id', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(2)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].receivedMessageId === undefined ? dashboard.filteredMessages[i].receivedMessageId : Number.MAX_VALUE;
          const next = dashboard.filteredMessages[i + 1].receivedMessageId === undefined ? dashboard.filteredMessages[i + 1].receivedMessageId : Number.MAX_VALUE;
          if (next < curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by sent id reversed', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(3)')
      .click()
      .get('mina-dashboard-table .head > span:nth-child(3)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].sentMessageId === undefined ? dashboard.filteredMessages[i].sentMessageId : Number.MAX_VALUE;
          const next = dashboard.filteredMessages[i + 1].sentMessageId === undefined ? dashboard.filteredMessages[i + 1].sentMessageId : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by hash reversed', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(4)')
      .click()
      .get('mina-dashboard-table .head > span:nth-child(4)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].hash || '';
          const next = dashboard.filteredMessages[i + 1].hash || '';
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
      .get('mina-dashboard-table .head > span:nth-child(5)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].height === undefined ? dashboard.filteredMessages[i].height : Number.MAX_VALUE;
          const next = dashboard.filteredMessages[i + 1].height === undefined ? dashboard.filteredMessages[i + 1].height : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by source', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(6)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].sourceAddr || '';
          const next = dashboard.filteredMessages[i + 1].sourceAddr || '';
          if (next.localeCompare(curr) < 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by node', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(7)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].nodeAddr || '';
          const next = dashboard.filteredMessages[i + 1].nodeAddr || '';
          if (next.localeCompare(curr) < 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by destination', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(8)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].destAddr || '';
          const next = dashboard.filteredMessages[i + 1].destAddr || '';
          if (next.localeCompare(curr) < 0) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by rebroadcast latency', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(9)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].rebroadcastLatency === undefined ? dashboard.filteredMessages[i].rebroadcastLatency : Number.MAX_VALUE;
          const next = dashboard.filteredMessages[i + 1].rebroadcastLatency === undefined ? dashboard.filteredMessages[i + 1].rebroadcastLatency : Number.MAX_VALUE;
          if (next < curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });

  it('sort by block latency reversed', () => {
    cy
      .get('mina-dashboard-table .head > span:nth-child(10)')
      .click()
      .get('mina-dashboard-table .head > span:nth-child(10)')
      .click()
      .window()
      .its('store')
      .then(getDashboard)
      .then((dashboard: AggregatorState) => {
        let sorted = true;
        for (let i = 0; i < dashboard.filteredMessages.length - 1; i++) {
          const curr = dashboard.filteredMessages[i].blockLatency === undefined ? dashboard.filteredMessages[i].blockLatency : Number.MAX_VALUE;
          const next = dashboard.filteredMessages[i + 1].blockLatency === undefined ? dashboard.filteredMessages[i + 1].blockLatency : Number.MAX_VALUE;
          if (next > curr) {
            sorted = false;
            break;
          }
        }
        expect(sorted).to.be.true;
      });
  });
});
