import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { ExplorerScanStateLeaf } from '@shared/types/explorer/scan-state/explorer-scan-state-leaf.type';
import { selectExplorerScanStateTree } from '@explorer/scan-state/explorer-scan-state.state';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { filter } from 'rxjs';

export interface ScanStateSunburst {
  leaf: ExplorerScanStateLeaf;
  size?: number;
  children: ScanStateSunburst[];
}

@Component({
  selector: 'mina-explorer-scan-state-chart-list',
  templateUrl: './explorer-scan-state-chart-list.component.html',
  styleUrls: ['./explorer-scan-state-chart-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100 flex-column' },
})
export class ExplorerScanStateChartListComponent extends StoreDispatcher implements AfterViewInit {

  charts: ScanStateSunburst[];

  ngAfterViewInit(): void {
    this.listenToScanStateChange();
  }

  private listenToScanStateChange(): void {
    this.select(selectExplorerScanStateTree, (scanState: ExplorerScanStateTree[]) => {
      this.charts = scanState
      // this.charts = [scanState[0],scanState[9]]
        .map(ss => buildTree(ss.leafs));

      this.detect();
    }, filter(ss => ss.length > 0));
  }

}

function buildTree(leafs: ExplorerScanStateLeaf[]): ScanStateSunburst {
  const root: ScanStateSunburst = { leaf: leafs[0], children: [] };
  const stack: [ScanStateSunburst, number][] = [[root, 0]];

  while (stack.length > 0) {
    const [currentNode, currentIndex] = stack.pop()!;

    const leftChildIndex = 2 * currentIndex + 1;
    const rightChildIndex = 2 * currentIndex + 2;

    if (leftChildIndex < leafs.length) {
      const leftChild: ScanStateSunburst = { leaf: leafs[leftChildIndex], children: [] };
      currentNode.children.push(leftChild);
      stack.push([leftChild, leftChildIndex]);
    }

    if (rightChildIndex < leafs.length) {
      const rightChild: ScanStateSunburst = { leaf: leafs[rightChildIndex], children: [] };
      currentNode.children.push(rightChild);
      stack.push([rightChild, rightChildIndex]);
    }

    if (leftChildIndex >= leafs.length && rightChildIndex >= leafs.length) {
      currentNode.size = 1;
    }
  }

  return root;
}
