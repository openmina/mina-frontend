import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MinaErrorType } from '@shared/types/error-preview/mina-error-type.enum';

@Component({
  selector: 'mina-error-list',
  templateUrl: './error-list.component.html',
  styleUrls: ['./error-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'border-rad-6 border overflow-y-auto' },
})
export class ErrorListComponent {

  readonly errorIconMap = {
    [MinaErrorType.GRAPH_QL]: 'dns',
    [MinaErrorType.DEBUGGER]: 'code',
    [MinaErrorType.WEB_NODE]: 'language',
    [MinaErrorType.GENERIC]: 'error',
  };

  @Input() errors: any[];
  @Output() onConfirm: EventEmitter<any> = new EventEmitter<any>();

  close(): void {
    this.onConfirm.emit();
  }
}
