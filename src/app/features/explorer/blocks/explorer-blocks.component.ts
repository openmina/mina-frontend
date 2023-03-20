import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { filter, skip } from 'rxjs';
import { ExplorerBlocksClose, ExplorerBlocksGetBlocks } from '@explorer/blocks/explorer-blocks.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-explorer-blocks',
  templateUrl: './explorer-blocks.component.html',
  styleUrls: ['./explorer-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerBlocksComponent extends StoreDispatcher implements OnInit, OnDestroy {

  private blockLevel: number;

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.select(selectActiveNode, () => {
      this.getBlocks();
    }, filter(Boolean), skip(1));

    this.select(selectAppNodeStatus, (status: NodeStatus) => {
      this.blockLevel = status.blockLevel;
      this.getBlocks();
    }, filter(Boolean), filter((status: NodeStatus) => status.blockLevel !== this.blockLevel));
  }

  private getBlocks(): void {
    this.dispatch(ExplorerBlocksGetBlocks);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ExplorerBlocksClose);
  }
}
