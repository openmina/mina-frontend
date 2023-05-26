import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { selectActiveNode } from '@app/app.state';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';

@Component({
  selector: 'mina-logs-toolbar',
  templateUrl: './logs-toolbar.component.html',
  styleUrls: ['./logs-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fx-row-vert-cent h-xl border-bottom flex-between pr-10 pl-10' },
})
export class LogsToolbarComponent extends StoreDispatcher implements OnInit {

  downloadURL: string;

  ngOnInit(): void {
    this.listenToActiveNodeChange();
  }

  private listenToActiveNodeChange(): void {
    this.select(selectActiveNode, (node: MinaNode) => {
      this.downloadURL = `${origin}/${node.name}/logs/download`;
      this.detect();
    });
  }
}
