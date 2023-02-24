import { ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { selectExplorerScanStateCenterTrees, selectExplorerScanStateTree } from '@explorer/scan-state/explorer-scan-state.state';
import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';
import { ExplorerScanStateLeaf } from '@shared/types/explorer/scan-state/explorer-scan-state-leaf.type';
import { skip } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-scan-state-list',
  templateUrl: './explorer-scan-state-list.component.html',
  styleUrls: ['./explorer-scan-state-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column' },
})
export class ExplorerScanStateListComponent extends ManualDetection implements OnInit {

  scanStateTrees: ExplorerScanStateTree[];

  readonly leafTrackBy = (index: number, leaf: ExplorerScanStateLeaf) => leaf[0] + leaf[1] + leaf[2] + leaf[3] + leaf[4];
  readonly treeTrackBy = (index: number) => index;

  private trees: QueryList<ElementRef<HTMLDivElement>>;
  private isFirstRendering: boolean;

  @ViewChildren('trees') set content(content: QueryList<ElementRef<HTMLDivElement>>) {
    if (content) {
      this.trees = content;
    }
  }

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToScanStateChange();
    this.listenToCenterTrees();
  }

  private listenToScanStateChange(): void {
    this.store.select(selectExplorerScanStateTree)
      .pipe(untilDestroyed(this))
      .subscribe((scanState: ExplorerScanStateTree[]) => {
        if (!this.isFirstRendering && this.scanStateTrees?.length === 0) {
          this.isFirstRendering = true;
        }
        this.scanStateTrees = scanState;
        this.detect();
        if (this.isFirstRendering) {
          delete this.isFirstRendering;
          this.scrollTreesToCenter();
        }
      });
  }

  private listenToCenterTrees(): void {
    this.store.select(selectExplorerScanStateCenterTrees)
      .pipe(untilDestroyed(this), skip(1))
      .subscribe(() => this.scrollTreesToCenter());
  }

  private scrollTreesToCenter(): void {
    this.trees.forEach((item: ElementRef<HTMLDivElement>) => {
      item.nativeElement.scrollTo({ left: item.nativeElement.scrollWidth / 2 - item.nativeElement.offsetWidth / 2 });
    });
  }
}
