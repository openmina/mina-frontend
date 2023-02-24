import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ManualDetection } from '@shared/base-classes/manual-detection.class';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { selectAppMenu } from '@app/app.state';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { SharedModule } from '@shared/shared.module';

@UntilDestroy()
@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'mina-table',
  templateUrl: './mina-table.component.html',
  styleUrls: ['./mina-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 d-flex' },
})
export class MinaTableComponent<T = any> extends ManualDetection {

  itemSize: number = 32;
  isMobile: boolean;

  items: T[];
  headerCells: string[];
  rowTemplate: TemplateRef<T>;
  propertyForActiveCheck: string;
  activeItem: T;
  gridTemplateColumns: number[] = [];

  readonly rowClickEmitter = new EventEmitter<T>();

  @ViewChild(CdkVirtualScrollViewport) private virtualScroll: CdkVirtualScrollViewport;

  constructor(private store: Store<MinaState>) { super(); }

  init(): void {
    this.listenToMenuChange();
    this.addGridTemplateColumns();
    // this.createMobileItems();
    this.detect();
  }

  private addGridTemplateColumns(): void {
    let value = 'mina-table .mina-table .row{grid-template-columns:';
    this.gridTemplateColumns.forEach(v => value += `${v}px `);
    document.getElementById('table-style').textContent = value + '}';
  }

  private listenToMenuChange(): void {
    this.store.select(selectAppMenu)
      .pipe(
        untilDestroyed(this),
        filter(menu => menu.isMobile !== this.isMobile),
      )
      .subscribe((menu: AppMenu) => {
        this.isMobile = menu.isMobile;
        this.itemSize = menu.isMobile ? 200 : 32;
        this.virtualScroll?.checkViewportSize();
        this.detect();
      });
  }

  onItemClick(item: T): void {
    this.rowClickEmitter.emit(item);
  }
}
