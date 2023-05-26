import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DashboardSplitsClose, DashboardSplitsGetSplits } from '@dashboard/splits/dashboard-splits.actions';

@Component({
  selector: 'mina-splits',
  templateUrl: './dashboard-splits.component.html',
  styleUrls: ['./dashboard-splits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-100' },
})
export class DashboardSplitsComponent extends StoreDispatcher implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.dispatch(DashboardSplitsGetSplits);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DashboardSplitsClose);
  }
}
