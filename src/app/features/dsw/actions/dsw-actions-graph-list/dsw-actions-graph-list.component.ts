import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectDswActionsGroups, selectDswActionsOpenSidePanel } from '@dsw/actions/dsw-actions.state';
import { DswActionGroup } from '@shared/types/dsw/actions/dsw-action-group.type';
import { DswActionsToggleSidePanel } from '@dsw/actions/dsw-actions.actions';
import { DswActionGroupAction } from '@shared/types/dsw/actions/dsw-action-group-action.type';
import { delay } from 'rxjs';


@Component({
  selector: 'mina-dsw-actions-graph-list',
  templateUrl: './dsw-actions-graph-list.component.html',
  styleUrls: ['./dsw-actions-graph-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'p-relative' },
})
export class DswActionsGraphListComponent extends StoreDispatcher implements OnInit {

  readonly X_STEPS: string[] = ['0μs', '1μs', '10μs', '50μs', '100μs', '500μs', '1ms', '5ms', '50ms'];
  readonly RANGES: string[] = ['0μs - 1μs', '1μs - 10μs', '10μs - 50μs', '50μs - 100μs', '100μs - 500μs', '500μs - 1ms', '1ms - 5ms', '5ms - 50ms', '> 50ms'];
  readonly trackGroup = (index: number, group: DswActionGroup): string => group.groupName + group.totalTime + group.meanTime + group.count;
  readonly trackAction = (index: number, action: DswActionGroupAction): string => action.title;

  groups: DswActionGroup[] = [];
  sidePanelOpen: boolean;

  ngOnInit(): void {
    this.listenToGroups();
    this.listenToSidePanel();
  }

  private listenToSidePanel(): void {
    this.select(selectDswActionsOpenSidePanel, (open: boolean) => {
      this.sidePanelOpen = open;
      this.detect();
    }, delay(250));
  }

  private listenToGroups(): void {
    this.select(selectDswActionsGroups, (groups: DswActionGroup[]) => {
      this.groups = groups;
      this.detect();
    });
  }

  toggleSidePanel(): void {
    this.dispatch(DswActionsToggleSidePanel);
  }
}
