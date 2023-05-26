import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BenchmarksWalletsClose, BenchmarksWalletsGetWallets } from '@benchmarks/wallets/benchmarks-wallets.actions';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-benchmarks-wallets',
  templateUrl: './benchmarks-wallets.component.html',
  styleUrls: ['./benchmarks-wallets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class BenchmarksWalletsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.dispatch(BenchmarksWalletsGetWallets);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(BenchmarksWalletsClose);
  }
}
