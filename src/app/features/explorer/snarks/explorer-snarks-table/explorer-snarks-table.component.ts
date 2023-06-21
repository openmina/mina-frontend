import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerSnark } from '@shared/types/explorer/snarks/explorer-snarks.type';
import { ExplorerSnarksSetActiveSnark, ExplorerSnarksSort } from '@explorer/snarks/explorer-snarks.actions';
import { selectExplorerSnarks, selectExplorerSnarksActiveSnark, selectExplorerSnarksSorting } from '@explorer/snarks/explorer-snarks.state';
import { Router } from '@angular/router';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { filter, take } from 'rxjs';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

@Component({
  selector: 'mina-explorer-snarks-table',
  templateUrl: './explorer-snarks-table.component.html',
  styleUrls: ['./explorer-snarks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class ExplorerSnarksTableComponent extends MinaTableWrapper<ExplorerSnark> implements OnInit {

  protected readonly tableHeads: TableColumnList<ExplorerSnark> = [
    { name: 'prover' },
    { name: 'fee' },
    { name: 'work ids', sort: 'workIds' },
  ];

  snarks: ExplorerSnark[] = [];
  currentSort: TableSort<ExplorerSnark>;
  workIdsCount: number;

  private activeSnark: ExplorerSnark;
  private workIdsFromRoute: string;

  constructor(private router: Router) { super(); }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToRouteChange();
    this.listenToSnarks();
    this.listenToActiveSnarkChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [200, 120, '1fr'];
    this.table.minWidth = 550;
    this.table.sortClz = ExplorerSnarksSort;
    this.table.sortSelector = selectExplorerSnarksSorting;
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['workIds'] && this.table.rows.length === 0) {
        this.workIdsFromRoute = route.params['workIds'];
      }
    }, take(1));
  }

  private listenToSnarks(): void {
    this.select(selectExplorerSnarks, (snarks: ExplorerSnark[]) => {
      this.snarks = snarks;
      this.workIdsCount = snarks.reduce((sum: number, curr: ExplorerSnark) => sum + curr.workIds.split(',').length, 0);
      this.table.rows = snarks;
      this.table.detect();
      this.detect();
      if (this.workIdsFromRoute) {
        this.scrollToElement();
      }
    }, filter(snarks => snarks.length > 0));
  }

  private listenToActiveSnarkChange(): void {
    this.select(selectExplorerSnarksActiveSnark, (activeSnark: ExplorerSnark) => {
      this.activeSnark = activeSnark;
      this.table.activeRow = activeSnark;
      this.table.detect();
    }, filter(trace => trace !== this.activeSnark));
  }

  private scrollToElement(): void {
    const finder = (snark: ExplorerSnark) => snark.workIds === this.workIdsFromRoute;
    const i = this.table.rows.findIndex(finder);
    this.table.scrollToElement(finder);
    delete this.workIdsFromRoute;
    this.onRowClick(this.table.rows[i]);
  }

  protected override onRowClick(snark: ExplorerSnark): void {
    this.router.navigate([Routes.EXPLORER, Routes.SNARK_POOL, snark?.workIds]);
    this.dispatch(ExplorerSnarksSetActiveSnark, snark);
  }
}
