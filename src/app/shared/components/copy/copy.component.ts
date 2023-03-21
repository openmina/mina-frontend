import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mina-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'fx-row-vert-cent p-relative' },
})
export class CopyComponent implements OnInit {

  @Input() value: string;
  @Input() display: string;

  constructor() { }

  ngOnInit(): void {
  }

}
