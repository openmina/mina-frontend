import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswLiveActiveNode } from '@dsw/live/dsw-live.state';
import { DswLiveNode } from '@shared/types/dsw/live/dsw-live-node.type';

@Component({
  selector: 'mina-dsw-live-status-counts',
  templateUrl: './dsw-live-status-counts.component.html',
  styleUrls: ['./dsw-live-status-counts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-lg fx-row-vert-cent ml-10 mr-10' },
})
export class DswLiveStatusCountsComponent extends StoreDispatcher implements OnInit {

  missing: number = 0;
  fetching: number = 0;
  fetched: number = 0;
  applying: number = 0;
  applied: number = 0;

  ngOnInit(): void {
    this.listenToBestTip();
  }

  private listenToBestTip(): void {
    this.select(selectDswLiveActiveNode, (node: DswLiveNode) => {
      this.missing = node?.missingBlocks;
      this.fetching = node?.fetchingBlocks;
      this.fetched = node?.fetchedBlocks;
      this.applying = node?.applyingBlocks;
      this.applied = node?.appliedBlocks;
      this.detect();
    });
  }
}
