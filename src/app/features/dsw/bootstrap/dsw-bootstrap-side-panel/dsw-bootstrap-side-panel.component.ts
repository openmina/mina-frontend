import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { Router } from '@angular/router';
import { selectDswBootstrapActiveNode } from '@dsw/bootstrap/dsw-bootstrap.state';
import { DswBootstrapNode } from '@shared/types/dsw/bootstrap/dsw-bootstrap-node.type';

@Component({
  selector: 'mina-dsw-bootstrap-side-panel',
  templateUrl: './dsw-bootstrap-side-panel.component.html',
  styleUrls: ['./dsw-bootstrap-side-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class DswBootstrapSidePanelComponent extends StoreDispatcher implements OnInit {

  activeNode: DswBootstrapNode;
  activeScreen: number = 0;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToActiveNode();
  }

  private listenToActiveNode(): void {
    this.select(selectDswBootstrapActiveNode, (activeNode: DswBootstrapNode) => {
      this.activeNode = activeNode;
      if (this.activeNode) {
        this.activeScreen = 1;
      }
      this.detect();
    });
  }
}
