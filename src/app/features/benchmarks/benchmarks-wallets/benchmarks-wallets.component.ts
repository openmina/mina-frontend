import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { BenchmarksWallet } from '@shared/types/benchmarks/benchmarks-wallet.type';
import { selectBenchmarksWallets } from '@benchmarks/benchmarks.state';
import { filter, skip } from 'rxjs';
import { selectActiveNode, selectAppNodeStatus } from '@app/app.state';
import { BENCHMARKS_GET_WALLETS, BenchmarksGetWallets } from '@benchmarks/benchmarks.actions';
import { NodeStatus } from '@shared/types/app/node-status.type';

@UntilDestroy()
@Component({
  selector: 'mina-benchmarks-wallets',
  templateUrl: './benchmarks-wallets.component.html',
  styleUrls: ['./benchmarks-wallets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100' },
})
export class BenchmarksWalletsComponent extends ManualDetection implements OnInit {

  wallets: BenchmarksWallet[];

  private blockLevel: number;

  readonly trackWallets = (index: number, wallet: BenchmarksWallet) => wallet.lastTxMemo + wallet.nonce + wallet.mempoolNonce;

  constructor(private store: Store<MinaState>) { super(); }

  ngOnInit(): void {
    this.listenToActiveNodeChange();
    this.listenToWalletChanges();
  }

  private listenToActiveNodeChange(): void {
    this.store.dispatch<BenchmarksGetWallets>({ type: BENCHMARKS_GET_WALLETS });
    this.store.select(selectActiveNode)
      .pipe(untilDestroyed(this), filter(Boolean), skip(1))
      .subscribe(() => {
        this.store.dispatch<BenchmarksGetWallets>({ type: BENCHMARKS_GET_WALLETS });
      });
    this.store.select(selectAppNodeStatus)
      .pipe(
        untilDestroyed(this),
        filter(Boolean),
        filter(status => status.blockLevel !== this.blockLevel),
      )
      .subscribe((status: NodeStatus) => {
        this.blockLevel = status.blockLevel;
        this.store.dispatch<BenchmarksGetWallets>({ type: BENCHMARKS_GET_WALLETS });
      });
  }

  private listenToWalletChanges(): void {
    this.store.select(selectBenchmarksWallets)
      .pipe(untilDestroyed(this), filter(wallets => wallets.length > 0))
      .subscribe(wallets => {
        this.wallets = wallets;
        this.detect();
      });
  }
}

