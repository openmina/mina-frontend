import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { EagerSharedModule } from '@shared/eager-shared.module';

@Component({
  selector: 'mina-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EagerSharedModule],
})
export class CopyComponent implements OnInit {

  @Input() value: string;
  @Input() display: string;
  @Input() hidden: boolean = true;

  @HostBinding('class.no-hide') get isHidden(): boolean {
    return !this.hidden;
  }

  ngOnInit(): void {
    if (this.display === undefined) {
      this.display = this.value;
    }
  }

}
