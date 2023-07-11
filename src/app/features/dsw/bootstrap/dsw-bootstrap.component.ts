import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { DswBootstrapClose, DswBootstrapGetBlocks } from '@dsw/bootstrap/dsw-bootstrap.actions';

@Component({
  selector: 'mina-dsw-bootstrap',
  templateUrl: './dsw-bootstrap.component.html',
  styleUrls: ['./dsw-bootstrap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DswBootstrapComponent extends StoreDispatcher implements OnInit, OnDestroy {

  isActiveRow: boolean;

  constructor(public el: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.dispatch(DswBootstrapGetBlocks);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(DswBootstrapClose);
  }
}
