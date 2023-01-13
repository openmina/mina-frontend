import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { filter, skip } from 'rxjs';
import { EXPLORER_BLOCKS_CLOSE, EXPLORER_BLOCKS_GET_BLOCKS, ExplorerBlocksClose, ExplorerBlocksGetBlocks } from '@explorer/blocks/explorer-blocks.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-blocks',
  templateUrl: './explorer-blocks.component.html',
  styleUrls: ['./explorer-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerBlocksComponent implements OnInit, OnDestroy {

  private blockLevel: number;

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.getBlocks();
      });
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(status => status.blockLevel !== this.blockLevel),
      )
      .subscribe((status: NodeStatus) => {
        this.blockLevel = status.blockLevel;
        this.getBlocks();
      });
  }

  private getBlocks(): void {
    this.store.dispatch<ExplorerBlocksGetBlocks>({ type: EXPLORER_BLOCKS_GET_BLOCKS });
  }

  ngOnDestroy(): void {
    this.store.dispatch<ExplorerBlocksClose>({ type: EXPLORER_BLOCKS_CLOSE });
  }
}
