import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, skip } from 'rxjs';
import { EXPLORER_SNARKS_CLOSE, EXPLORER_SNARKS_GET_SNARKS, ExplorerSnarksClose, ExplorerSnarksGetSnarks } from '@explorer/snarks/explorer-snarks.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-explorer-snarks',
  templateUrl: './explorer-snarks.component.html',
  styleUrls: ['./explorer-snarks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorerSnarksComponent implements OnInit, OnDestroy {

  private blockLevel: number;

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    this.listenToActiveNodeAndBlockChange();
  }

  private listenToActiveNodeAndBlockChange(): void {
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.getSnarks();
      });
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(status => status.blockLevel !== this.blockLevel),
      )
      .subscribe((status: NodeStatus) => {
        this.blockLevel = status.blockLevel;
        this.getSnarks();
      });
  }

  private getSnarks(): void {
    this.store.dispatch<ExplorerSnarksGetSnarks>({ type: EXPLORER_SNARKS_GET_SNARKS });
  }

  ngOnDestroy(): void {
    this.store.dispatch<ExplorerSnarksClose>({ type: EXPLORER_SNARKS_CLOSE });
  }
}
