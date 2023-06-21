import { Injectable } from '@angular/core';
import { concatAll, forkJoin, from, map, Observable, toArray } from 'rxjs';
import { CONFIG } from '@shared/constants/config';
import { HttpClient } from '@angular/common/http';
import { DashboardSplits } from '@shared/types/dashboard/splits/dashboard-splits.type';
import { DashboardSplitsPeer } from '@shared/types/dashboard/splits/dashboard-splits-peer.type';
import { DashboardSplitsLink } from '@shared/types/dashboard/splits/dashboard-splits-link.type';

@Injectable({ providedIn: 'root' })
export class DashboardSplitsService {

  private readonly options = { headers: { 'Content-Type': 'application/json' } };

  constructor(private http: HttpClient) { }

  getPeers(): Observable<DashboardSplits> {
    return from(
      CONFIG.configs.map(node =>
        this.http
          .post<{ data: GetPeersResponse }>(`${node.graphql}/graphql`, { query: peersQuery }, this.options)
          .pipe(
            map(response => ({ data: response.data, node: node.name })),
          ),
      ),
    ).pipe(
      concatAll(),
      toArray(),
      map((array: { data: GetPeersResponse, node: string }[]) => {
        const map = new Map<string, string>();
        array.forEach(({ data, node }: { data: GetPeersResponse, node: string }) => {
          node = node.charAt(0).toUpperCase() + node.slice(1);
          node = node.replace(/(\d+)/g, ' $1');
          map.set(data.daemonStatus.addrsAndPorts.externalIp, node);
        });
        return array.reduce((acc: DashboardSplits, { data }: { data: GetPeersResponse }) => {
          acc.peers.push(
            ...[
              ...data.getPeers.map((p: GetPeers) => ({ address: p.host, peerId: p.peerId, node: map.get(p.host) })),
              {
                address: data.daemonStatus.addrsAndPorts.externalIp,
                peerId: data.daemonStatus.addrsAndPorts.peer.peerId,
                node: map.get(data.daemonStatus.addrsAndPorts.externalIp),
              },
            ],
          );
          acc.links.push(
            ...data.getPeers.map((p: GetPeers) => ({
              source: data.daemonStatus.addrsAndPorts.externalIp,
              target: p.host,
            })),
          );
          return acc;
        }, { peers: new Array<DashboardSplitsPeer>(), links: new Array<DashboardSplitsLink>() });
      }),
      map((response: DashboardSplits) => this.removeDuplicatedPeers(response)),
    );
  }

  splitNodes(peers: DashboardSplitsPeer[]): Observable<void> {
    const nodeName = (peer: DashboardSplitsPeer) => peer.node.toLowerCase().replace(' ', '');
    const lastChar = (str: string) => str[str.length - 1];
    const leftList = peers.filter(p => p.node).filter(p => Number(lastChar(p.node)) % 2 === 0);
    const rightList = peers.filter(p => p.node).filter(p => Number(lastChar(p.node)) % 2 !== 0);

    const leftObs = from(
      leftList.map(node =>
        this.http
          .post<any>(CONFIG.configs.find(c => c.name === nodeName(node)).debugger + '/firewall/whitelist/enable', {
            'ips': leftList.map(n => n.address.split(':')[0]),
            'ports': [10909, 10001],
          }, this.options),
      ),
    ).pipe(
      concatAll(),
      toArray(),
    );
    const rightObs = from(
      rightList.map(node =>
        this.http
          .post<any>(CONFIG.configs.find(c => c.name === nodeName(node)).debugger + '/firewall/whitelist/enable', {
            'ips': rightList.map(n => n.address.split(':')[0]),
            'ports': [10909, 10001],
          }, this.options),
      ),
    ).pipe(
      concatAll(),
      toArray(),
    );

    return forkJoin([leftObs, rightObs]).pipe(map(() => void 0));
  }

  mergeNodes(peers: DashboardSplitsPeer[]): Observable<void> {
    const nodeName = (peer: DashboardSplitsPeer) => peer.node.toLowerCase().replace(' ', '');

    return from(
      peers.filter(p => p.node).map(node =>
        this.http.post<void>(
          CONFIG.configs.find(c => c.name === nodeName(node)).debugger + '/firewall/whitelist/disable', null, this.options,
        ),
      ),
    ).pipe(
      concatAll(),
      toArray(),
      map(() => void 0),
    );
  }

  private removeDuplicatedPeers(response: DashboardSplits): DashboardSplits {
    response.peers = response.peers.filter((peer: DashboardSplitsPeer, index: number, peers: DashboardSplitsPeer[]) =>
      index === peers.findIndex(p => p.address === peer.address),
    );
    return response;
  }
}

interface GetPeersResponse {
  getPeers: GetPeers[];
  daemonStatus: DaemonStatus;
}

interface GetPeers {
  host: string;
  libp2pPort: number;
  peerId: string;
}

interface DaemonStatus {
  addrsAndPorts: AddrsAndPorts;
}

interface AddrsAndPorts {
  externalIp: string;
  libp2pPort: number;
  peer: { peerId: string; };
}

const peersQuery = `
  query Peers {
    daemonStatus {
      addrsAndPorts {
        peer {
          peerId
        }
        externalIp
        libp2pPort
      }
    }
    getPeers {
      host
      libp2pPort
      peerId
    }
  }
`;
