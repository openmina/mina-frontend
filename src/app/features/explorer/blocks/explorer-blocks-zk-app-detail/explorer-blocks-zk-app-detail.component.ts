import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectExplorerBlocksActiveZkApp } from '@explorer/blocks/explorer-blocks.state';
import { ExplorerBlockZkApp } from '@shared/types/explorer/blocks/explorer-block-zk-app-type';
import { ExplorerBlocksSetActiveBlock, ExplorerBlocksSetActiveZkApp } from '@explorer/blocks/explorer-blocks.actions';
import { filter } from 'rxjs';
import { ExpandTracking } from '@shared/components/mina-json-viewer/mina-json-viewer.component';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { ONE_BILLION } from '@shared/constants/unit-measurements';
import { Router } from '@angular/router';
import { MinaTableWrapper } from '@shared/base-classes/mina-table-wrapper.class';

type ZkAppUpdate = {
  index: number;
  balance: string;
  appState: string;
  failure: string;
}

@Component({
  selector: 'mina-explorer-blocks-zk-app-detail',
  templateUrl: './explorer-blocks-zk-app-detail.component.html',
  styleUrls: ['./explorer-blocks-zk-app-detail.component.scss'],
  host: { class: 'h-100 flex-column' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerBlocksZkAppDetailComponent extends MinaTableWrapper<ZkAppUpdate> implements OnInit {

  zkApp: ExplorerBlockZkApp;
  zkAppUpdates: ZkAppUpdate[] = [];
  expandTracking: ExpandTracking;

  protected readonly tableHeads: TableColumnList<ZkAppUpdate> = [
    { name: '#' },
    { name: 'Balance' },
    { name: 'App State' },
    { name: 'Failure' },
  ];

  constructor(private router: Router) { super() }

  override async ngOnInit(): Promise<void> {
    await super.ngOnInit();
    this.listenToActiveZkAppChange();
  }

  protected override setupTable(): void {
    this.table.gridTemplateColumns = [50, 80, 140, 150];
    this.table.tableLevel = 3;
  }

  private listenToActiveZkAppChange(): void {
    this.select(selectExplorerBlocksActiveZkApp, (zkApp: ExplorerBlockZkApp) => {
      this.zkApp = zkApp;
      this.zkAppUpdates = zkApp.zkAppFullData.zkappCommand.accountUpdates.map((update, index: number) => ({
        index,
        appState: update.body.update.appState.filter(Boolean).join(', ').trim(),
        balance: (update.body.balanceChange.sgn === 'Positive' ? '' : '-') + Number(update.body.balanceChange.magnitude) / ONE_BILLION,
        failure: zkApp.zkAppFullData.failureReason[index].failures[0],
      }));
      this.table.rows = this.zkAppUpdates;
      this.table.detect();
      this.detect();
    }, filter(Boolean));
  }

  closeSidePanel(): void {
    this.removeActiveZkApp();
    this.dispatch(ExplorerBlocksSetActiveBlock, undefined);
  }

  removeActiveZkApp(): void {
    this.dispatch(ExplorerBlocksSetActiveZkApp, undefined);
    this.router.navigate([], {
      queryParams: {
        activeZkApp: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
