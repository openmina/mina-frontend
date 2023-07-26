import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mina-dsw-live-filters',
  templateUrl: './dsw-live-filters.component.html',
  styleUrls: ['./dsw-live-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-lg fx-row-vert-cent' },
})
export class DswLiveFiltersComponent {

}
