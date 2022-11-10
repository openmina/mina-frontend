import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { Router } from '@angular/router';
import { NetworkBlocksService } from '@network/blocks/network-blocks.service';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@Component({
  selector: 'mina-network-blocks-graph',
  templateUrl: './network-blocks-graph.component.html',
  styleUrls: ['./network-blocks-graph.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkBlocksGraphComponent extends ManualDetection implements OnInit {

  blocks: any[];
  bars: number[];

  constructor(private store: Store<MinaState>,
              private router: Router,
              private networkBlocksService: NetworkBlocksService) { super(); }

  ngOnInit(): void {
    this.listenToNetworkBlocks();
  }

  private listenToNetworkBlocks(): void {
    this.networkBlocksService.getBlocks()
      .subscribe((blocks: any[]) => {
        this.blocks = blocks;
        this.bars = blocks.map(b => b.received)
        this.detect();
      });
  }
}

