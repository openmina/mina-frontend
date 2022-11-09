import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'mina-network-connections-toolbar',
  templateUrl: './network-connections-toolbar.component.html',
  styleUrls: ['./network-connections-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row align-center pl-12 border-bottom' },
})
export class NetworkConnectionsToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
