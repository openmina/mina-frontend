import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { NetworkMessagesFilter } from '@shared/types/network/messages/network-messages-filter.type';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { selectNetworkBlocks, selectNetworkBlocksActiveBlock } from '@network/blocks/network-blocks.state';
import { NetworkBlock } from '@shared/types/network/blocks/network-block.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks-table',
  templateUrl: './network-blocks-table.component.html',
  styleUrls: ['./network-blocks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-100' },
})
export class NetworkBlocksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-' };

  blocks: NetworkBlock[] = [];
  activeRow: NetworkBlock;
  activeFilters: NetworkMessagesFilter[] = [];
  idFromRoute: string;

  @ViewChild(CdkVirtualScrollViewport)
  public scrollViewport: CdkVirtualScrollViewport;


  constructor(private store: Store<MinaState>,
              private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
    this.listenToActiveRowChange();
    // this.listenToNetworkFilters();
    // this.listenToNetworkStream();
    // this.listenToVirtualScrolling();
  }

  private listenToNetworkBlocks(): void {
    this.store.select(selectNetworkBlocks)
      .pipe(untilDestroyed(this))
      .subscribe((blocks: NetworkBlock[]) => {
        this.blocks = blocks;
        this.detect();
        this.scrollToElement();
      });
  }

  private scrollToElement(): void {
    let scrollTo = this.blocks.length;
    if (this.idFromRoute) {
      const topElements = Math.floor(this.scrollViewport.elementRef.nativeElement.offsetHeight / 2 / this.itemSize);
      scrollTo = this.blocks.findIndex(m => m.hash === this.idFromRoute) - topElements;
      this.idFromRoute = undefined;
    }
    this.scrollViewport.scrollToIndex(scrollTo);
  }

  private listenToActiveRowChange(): void {
    this.store.select(selectNetworkBlocksActiveBlock)
      .pipe(untilDestroyed(this))
      .subscribe((row: NetworkBlock) => {
        this.activeRow = row;
        this.detect();
      });
  }

  onRowClick(row: NetworkBlock): void {
    // if (row.hash !== this.activeRow?.hash) {
      // this.router.navigate([Routes.NETWORK, Routes.BLOCKS, row.hash], { queryParamsHandling: 'merge' });
      // this.store.dispatch<NetworkMessagesSetActiveRow>({ type: NETWORK_SET_ACTIVE_ROW, payload: row });
    // }
  }

  seeMessageInMessages(messageId: number): void {
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES, messageId]);
  }

  seeMessagesForAddress(addr: string): void {
    if (addr === 'local node') {
      return;
    }
    this.router.navigate([Routes.NETWORK, Routes.MESSAGES], {
      queryParams: { addr },
    });
  }

  // private listenToNetworkStream(): void {
  //   this.store.select(selectNetworkStream)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((stream: boolean) => this.stream = stream);
  // }


  // private listenToNetworkFilters(): void {
  //   this.store.select(selectNetworkActiveFilters)
  //     .pipe(untilDestroyed(this))
  //     .subscribe((activeFilters: NetworkMessagesFilter[]) => {
  //       this.activeFilters = activeFilters;
  //     });
  // }

  // private listenToVirtualScrolling(): void {
  //   fromEvent(this.scrollViewport.elementRef.nativeElement.firstChild, 'wheel', { passive: true })
  //     .pipe(
  //       untilDestroyed(this),
  //       throttleTime(600),
  //       filter((event: Event) => this.stream && (event as WheelEvent).deltaY < 0),
  //     )
  //     .subscribe(() => this.pause());
  //   fromEvent(this.scrollViewport.elementRef.nativeElement, 'touchmove', { passive: true })
  //     .pipe(
  //       untilDestroyed(this),
  //       throttleTime(600),
  //       filter(() => this.stream),
  //     )
  //     .subscribe(() => this.pause());
  // }

  // private pause(): void {
  //   this.store.dispatch<NetworkMessagesPause>({ type: NETWORK_PAUSE });
  // }

}
