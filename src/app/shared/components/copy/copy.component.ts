import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mina-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyComponent implements OnInit {

  @Input() value: string;
  @Input() display: string;
  @Input() hidden: boolean = true;

  ngOnInit(): void {
    if (this.display === undefined) {
      this.display = this.value;
    }
  }

}
