import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { DswActionsToggleSidePanel } from '@dsw/actions/dsw-actions.actions';
import { selectDswActionsActiveSlotAndStats, selectDswActionsGroups, selectDswActionsSort } from '@dsw/actions/dsw-actions.state';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { DOCUMENT } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { isMobile } from '@shared/helpers/values.helper';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';
import { DswActionsStats } from '@shared/types/dsw/actions/dsw-actions-stats.type';
import { SecDurationConfig } from '@shared/pipes/sec-duration.pipe';

@Component({
  selector: 'mina-dsw-actions-side-panel',
  templateUrl: './dsw-actions-side-panel.component.html',
  styleUrls: ['./dsw-actions-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswActionsSidePanelComponent extends MinaTableWrapper<DswActionGroup> implements OnInit {

  activeSlot: number;
  stats: DswActionsStats = {} as DswActionsStats;
  readonly secConfig: SecDurationConfig = { onlySeconds: true, undefinedAlternative: '-' };

  protected readonly tableHeads: TableColumnList<DswActionGroup> = [
    { name: 'category' },
    { name: 'calls', sort: 'count' },
    { name: 'mean', sort: 'meanTime' },
    { name: 'total', sort: 'totalTime' },
  ];

  constructor(@Inject(DOCUMENT) private document: Document) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToSlotChange();
    this.listenToActionsChange();
    this.listenToSort();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = ['auto', 60, 80, 105];
    this.table.minWidth = 350;
  }

  closeSidePanel(): void {
    this.dispatch(DswActionsToggleSidePanel);
  }

  private listenToSlotChange(): void {
    this.select(selectDswActionsActiveSlotAndStats, ([activeSlot, stats]: [number, DswActionsStats]) => {
      this.activeSlot = activeSlot;
      this.stats = stats;
      this.detect();
    });
  }

  private listenToActionsChange(): void {
    this.select(selectDswActionsGroups, (groups: DswActionGroup[]) => {
      this.table.rows = groups.filter(g => g.display);
      this.table.detect();
      this.detect();
    });
  }

  private listenToSort(): void {
    if (isMobile()) return;
    const primary = 'primary';
    const tableHeads = this.document.querySelectorAll('mina-table .row.head span');
    this.select(selectDswActionsSort, (sort: TableSort<DswActionGroup>) => {
      const activeSortColumnIndex = this.tableHeads.findIndex(h => h.sort === sort.sortBy);
      tableHeads.forEach(span => span.classList.remove(primary));
      tableHeads.item(activeSortColumnIndex).classList.add(primary);
    }, distinctUntilChanged((curr, prev) => curr.sortBy === prev.sortBy));
  }
}
