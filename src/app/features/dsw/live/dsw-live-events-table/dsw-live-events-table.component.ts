import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mina-dsw-live-events-table',
  templateUrl: './dsw-live-events-table.component.html',
  styleUrls: ['./dsw-live-events-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-minus-lg flex-column' },
})
export class DswLiveEventsTableComponent {

}
