import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FuzzingClose, FuzzingGetFiles } from '@fuzzing/fuzzing.actions';

@Component({
  selector: 'mina-fuzzing',
  templateUrl: './fuzzing.component.html',
  styleUrls: ['./fuzzing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row h-100' },
})
export class FuzzingComponent extends StoreDispatcher implements OnInit {

  ngOnInit(): void {
    this.dispatch(FuzzingGetFiles);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.dispatch(FuzzingClose);
  }

}
