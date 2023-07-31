import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DswDashboardBlock } from '@app/shared/types/dsw/dashboard/dsw-dashboard-block.type';
import { DswLiveNode } from '@app/shared/types/dsw/live/dsw-live-node.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswLiveActiveNode } from '../dsw-live.state';
import { lastItem } from '@shared/helpers/array.helper';

@Component({
  selector: 'mina-dsw-live-blocks-map',
  templateUrl: './dsw-live-blocks-map.component.html',
  styleUrls: ['./dsw-live-blocks-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-minus-lg flex-column' },
})
export class DswLiveBlocksMapComponent extends StoreDispatcher implements OnInit {

  blocks: DswDashboardBlock[] = [];
  rootBlock: DswDashboardBlock;
  bestTipBlock: DswDashboardBlock;

  ngOnInit(): void {
    this.listenToBestTip();
  }

  private listenToBestTip(): void {
    this.select(selectDswLiveActiveNode, (node: DswLiveNode) => {
      this.rootBlock = null;
      this.bestTipBlock = null;
      this.blocks = (node?.blocks || []).slice().reverse();
      if (this.blocks.length === 291) {
        this.rootBlock = this.blocks[0];
        this.blocks = this.blocks.slice(1);
      }
      if (this.blocks.length > 0) {
        this.bestTipBlock = lastItem(this.blocks);
        this.blocks = this.blocks.slice(0, -1);
      }
      this.detect();
    });
  }
}
