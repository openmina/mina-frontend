import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DswFrontierLogLevels } from '@app/shared/types/dsw/frontier/dsw-frontier-log.type';

@Component({
  selector: 'mina-dsw-frontier-toolbar',
  templateUrl: './dsw-frontier-toolbar.component.html',
  styleUrls: ['./dsw-frontier-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fx-row-vert-cent h-xl pl-12 border-bottom' },
})
export class DswFrontierToolbarComponent {

  availableLevels = Object.values(DswFrontierLogLevels);
}
