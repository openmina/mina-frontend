import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';
import { EXPLORER_SNARKS_SORT, ExplorerSnarksSort } from '@explorer/snarks/explorer-snarks.actions';
import { selectExplorerSnarks, selectExplorerSnarksSorting } from '@explorer/snarks/explorer-snarks.state';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-snarks-table',
  templateUrl: './explorer-snarks-table.component.html',
  styleUrls: ['./explorer-snarks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerSnarksTableComponent extends ManualDetection implements OnInit {

  readonly itemSize: number = 36;
  readonly secConfig: SecDurationConfig = { color: true, yellow: 0.5, orange: 0.75, red: 1, undefinedAlternative: '-' };
  readonly tableHeads: TableHeadSorting<ExplorerSnark>[] = [
    { name: 'prover' },
    { name: 'fee' },
    { name: 'workIds' },
  ];

  snarks: ExplorerSnark[] = [];
  currentSort: TableSort<ExplorerSnark>;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToSortingChanges();
    this.listenToBlocks();
  }

  private listenToBlocks(): void {
    this.store.select(selectExplorerSnarks)
      .pipe(untilDestroyed(this))
      .subscribe((snarks: ExplorerSnark[]) => {
        this.snarks = snarks;
        this.detect();
      });
  }

  private listenToSortingChanges(): void {
    this.store.select(selectExplorerSnarksSorting)
      .pipe(untilDestroyed(this))
      .subscribe(sort => {
        this.currentSort = sort;
        this.detect();
      });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.store.dispatch<ExplorerSnarksSort>({
      type: EXPLORER_SNARKS_SORT,
      payload: { sortBy: sortBy as keyof ExplorerSnark, sortDirection },
    });
  }
}
