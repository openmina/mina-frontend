import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';

@Component({
  selector: 'mina-web-node-demo',
  templateUrl: './web-node-demo.component.html',
  styleUrls: ['./web-node-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 w-100 bg-base flex-column' },
})
export class WebNodeDemoComponent extends ManualDetection implements OnInit {

  constructor() { super(); }

  ngOnInit(): void {
  }
}
