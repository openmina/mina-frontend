import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectNetworkActiveFilters } from '@network/network.state';
import { NetworkFilterCategory } from '@shared/types/network/network-filter-group.type';
import { NETWORK_TOGGLE_FILTER, NetworkToggleFilter } from '@network/network.actions';
import { NetworkFilter } from '@shared/types/network/network-filter.type';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NetworkFilterTypes } from '@shared/types/network/network-filter-types.enum';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { ActivatedRoute, Router } from '@angular/router';
import { skip } from 'rxjs';

export const networkAvailableFilters: NetworkFilterCategory[][] = [
  [
    {
      name: '/multistream/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Multistream', value: '/multistream/1.0.0', tooltip: '' },
      ],
    },
    {
      name: '/coda/mplex/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Coda mplex', value: '/coda/mplex/1.0.0', tooltip: '' },
      ],
    },
  ],
  [
    {
      name: '/noise',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Handshake', value: '/noise', tooltip: '' },
      ],
    },
    {
      name: '/coda/kad/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Put Value', value: 'put_value', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get Value', value: 'get_value', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Add Provider', value: 'add_provider', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get Providers', value: 'get_providers', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Find Node', value: 'find_node', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Ping', value: 'ping', tooltip: '' },
      ],
    },
  ],
  [
    {
      name: '/mina/peer-exchange',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Peer Exchange', value: '/mina/peer-exchange', tooltip: '' },
      ],
    },
    {
      name: '/mina/bitswap-exchange',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Bitswap Exchange', value: '/mina/bitswap-exchange', tooltip: '' },
      ],
    },
    {
      name: '/mina/node-status',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Node Status', value: '/mina/node-status', tooltip: '' },
      ],
    },
  ],
  [
    {
      name: '/ipfs/id/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Identify', value: '/ipfs/id/1.0.0', tooltip: '' },
      ],
    },
    {
      name: '/ipfs/id/push/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'IPFS Push', value: '/ipfs/id/push/1.0.0', tooltip: '' },
      ],
    },
    {
      name: '/p2p/id/delta/1.0.0',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'IPFS Delta', value: '/p2p/id/delta/1.0.0', tooltip: '' },
      ],
    },
  ],
  [
    {
      name: '/meshsub/1.1.0',
      tooltip: 'Peers keep track of which topics their directly-connected peers are subscribed to. Using this information each peer is able to build up a picture of the topics around them and which peers are subscribed to each topic.\n Keeping track of subscriptions happens by sending subscribe and unsubscribe messages. When a new connection is established between two peers they start by sending each other the list of topics they are subscribed to.',
      filters: [
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Subscribe',
          value: 'subscribe',
          tooltip: 'Subscribe and unsubscribe messages go hand-in-hand with graft and prune messages. When a peer subscribes to a topic it will pick some peers that will become its full-message peers for that topic and send them graft messages at the same time as their subscribe messages.\n' +
            'Then over time, whenever a peer subscribes or unsubscribes from a topic, it will send each of its peers a subscribe or unsubscribe message. These messages are sent to all connected peers regardless of whether the receiving peer is subscribed to the topic in question.',
        },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Unsubscribe',
          value: 'unsubscribe',
          tooltip: 'When a peer unsubscribes from a topic it will notify its full-message peers that their connection has been pruned at the same time as sending their unsubscribe messages.',
        },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Control',
          value: 'meshsub_control',
          tooltip: 'Control messages are exchanged to maintain topic meshes and emit gossip. This section lists the control messages in the core gossipsub protocol, although it is worth noting that extensions to gossipsub (such as episub may define further control messages for their own purposes.',
        },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Publish External Transition',
          value: 'publish_external_transition',
          tooltip: 'Gets published when the new block is available. Unlike v2, here whole block is broadcasted. So header + body.',
        },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Publish Snark Pool Diff',
          value: 'publish_snark_pool_diff',
          tooltip: 'Used for broadcasting snarks for transactions.',
        },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Publish Transaction Pool Diff',
          value: 'publish_transaction_pool_diff',
          tooltip: 'Used for broadcasting new transactions.',
        },
      ],
    },
  ],
  [
    {
      name: 'coda/rpcs/0.0.1',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get some initial peers', value: 'get_some_initial_peers', tooltip: '' },
        {
          type: NetworkFilterTypes.MESSAGE_KIND,
          display: 'Get staged ledger aux and pending coinbases at hash',
          value: 'get_staged_ledger_aux_and_pending_coinbases_at_hash', tooltip: '',
        },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Answer sync ledger query', value: 'answer_sync_ledger_query', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get ancestry', value: 'get_ancestry', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get best tip', value: 'get_best_tip', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get node status', value: 'get_node_status', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get transition chain proof', value: 'get_transition_chain_proof', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get transition chain', value: 'get_transition_chain', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get transition knowledge', value: 'get_transition_knowledge', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Get epoch ledger', value: 'get_epoch_ledger', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Versioned rpc menu', value: '__Versioned_rpc.Menu', tooltip: '' },
        { type: NetworkFilterTypes.MESSAGE_KIND, display: 'Ban notify', value: 'ban_notify', tooltip: '' },
      ],
    },
  ],
  [
    {
      name: 'unknown',
      tooltip: '',
      filters: [
        { type: NetworkFilterTypes.STREAM_KIND, display: 'Unknown', value: 'unknown', tooltip: '' },
      ],
    },
  ],
];

@UntilDestroy()
@Component({
  selector: 'mina-network-filters',
  templateUrl: './network-filters.component.html',
  styleUrls: ['./network-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkFiltersComponent extends ManualDetection implements OnInit {

  @Output() onSizeChange: EventEmitter<void> = new EventEmitter<void>();

  availableFilters: NetworkFilterCategory[][] = networkAvailableFilters;
  activeFilters: NetworkFilter[] = [];
  filtersOpen: boolean;

  private elementHeight: number;

  constructor(private store: Store<MinaState>,
              private router: Router,
              private route: ActivatedRoute,
              private elementRef: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToNetworkFilters();
  }

  toggleFilerPanel(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  private listenToNetworkFilters(): void {
    this.store.select(selectNetworkActiveFilters)
      .pipe(untilDestroyed(this), skip(1))
      .subscribe((activeFilters: NetworkFilter[]) => {
        this.activeFilters = activeFilters;
        this.addFiltersToRoute();
        this.detect();
      });
  }

  private addFiltersToRoute(): void {
    const stream_kind = this.activeFilters.filter(f => f.type === NetworkFilterTypes.STREAM_KIND).map(f => f.value).join(',');
    const message_kind = this.activeFilters.filter(f => f.type === NetworkFilterTypes.MESSAGE_KIND).map(f => f.value).join(',');
    const connection_id = this.activeFilters.find(f => f.type === NetworkFilterTypes.CONNECTION_ID)?.value;
    const queryParams = {
      ...(stream_kind && { stream_kind }),
      ...(message_kind && { message_kind }),
      ...(connection_id && { connection_id }),
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
    });
  }

  toggleFilter(filter: NetworkFilter): void {
    const type = this.activeFilters.includes(filter) ? 'remove' : 'add';
    const filters = [filter];

    // if (filter.type === NetworkFilterTypes.CONNECTION_ID) {
    //   filters.push(...this.activeFilters.filter(f => f.type === NetworkFilterTypes.STREAM_ID))
    // }

    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
    this.onResize();
  }

  onResize(): void {
    if (this.elementHeight !== this.elementRef.nativeElement.offsetHeight) {
      this.elementHeight = this.elementRef.nativeElement.offsetHeight;
      this.onSizeChange.emit();
    }
  }

  filterByCategory(category: NetworkFilterCategory): void {
    const filters = category.filters;
    const type = filters.every(f => this.activeFilters.includes(f)) ? 'remove' : 'add';
    this.store.dispatch<NetworkToggleFilter>({ type: NETWORK_TOGGLE_FILTER, payload: { filters, type } });
  }
}
