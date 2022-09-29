import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mina-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-rad-6 border overflow-y-auto' },
})
export class ErrorListComponent {

  @Input() errors: any[];
  @Output() onConfirm: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  close(): void {
    this.onConfirm.emit();
  }
}
