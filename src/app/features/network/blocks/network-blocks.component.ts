import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'mina-network-blocks',
  templateUrl: './network-blocks.component.html',
  styleUrls: ['./network-blocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100' },
})
export class NetworkBlocksComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
