import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { filter, skip } from 'rxjs';
import { ExplorerBlocksClose, ExplorerBlocksGetBlocks } from '@explorer/blocks/explorer-blocks.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { ExplorerBlocksTableComponent } from '@explorer/blocks/explorer-blocks-table/explorer-blocks-table.component';
import { selectExplorerBlocksActiveBlock } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';

@Component({
  selector: 'mina-explorer-blocks',
  templateUrl: './explorer-blocks.component.html',
  styleUrls: ['./explorer-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerBlocksComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  private blockLevel: number;
  private removedClass: boolean;

  @ViewChild(ExplorerBlocksTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
    this.listenToActiveRowChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    const getBlocks = () => this.dispatch(ExplorerBlocksGetBlocks);
    this.select(selectActiveNode, () => {
      getBlocks();
    }, filter(Boolean), skip(1));

    this.select(selectAppNodeStatus, (status: NodeStatus) => {
      this.blockLevel = status.blockLevel;
      getBlocks();
    }, filter(Boolean), filter((status: NodeStatus) => status.blockLevel !== this.blockLevel));
  }

  private listenToActiveRowChange(): void {
    this.select(selectExplorerBlocksActiveBlock, (row: ExplorerBlock) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(ExplorerBlocksClose);
  }
}
