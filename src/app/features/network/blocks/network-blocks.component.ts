import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { NETWORK_BLOCKS_GET_BLOCKS, NetworkBlocksGetBlocks } from '@network/blocks/network-blocks.actions';
import { selectAppNodeStatus } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-network-blocks',
  templateUrl: './network-blocks.component.html',
  styleUrls: ['./network-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkBlocksComponent implements OnInit {

  private blockLevel: number;

  constructor(private store: Store<MinaState>) { }

  ngOnInit(): void {
    // this.store.dispatch<NetworkBlocksGetBlocks>({ type: NETWORK_BLOCKS_GET_BLOCKS });
    this.listenToActiveBlockChange();
  }

  private listenToActiveBlockChange(): void {
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        map((node: NodeStatus) => node.blockLevel),
        filter(blockLevel => this.blockLevel !== blockLevel),
      )
      .subscribe((blockLevel: number) => {
        this.blockLevel = blockLevel;
        this.store.dispatch<NetworkBlocksGetBlocks>({ type: NETWORK_BLOCKS_GET_BLOCKS });
      });
  }
}
