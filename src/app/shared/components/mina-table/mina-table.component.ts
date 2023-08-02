import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, TemplateRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { selectAppMenu } from '@app/app.state';
import { untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter } from 'rxjs';
import { AppMenu } from '@shared/types/app/app-menu.type';
import { SharedModule } from '@shared/shared.module';
import { DOCUMENT } from '@angular/common';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { MinaState } from '@app/app.setup';
import { hasValue, isMobile } from '@shared/helpers/values.helper';

const DESKTOP_ROW_HEIGHT = 36;

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'mina-table',
  templateUrl: './mina-table.component.html',
  styleUrls: ['./mina-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 flex-column' },
})
export class MinaTableComponent<T extends object> extends StoreDispatcher implements AfterViewInit {

  rowSize: number = DESKTOP_ROW_HEIGHT;
  isMobile: boolean;

  rows: T[] = [];
  activeRow: T;
  tableHeads: TableColumnList<T>;
  rowTemplate: TemplateRef<T>;
  currentSort: TableSort<T>;
  thGroupsTemplate: TemplateRef<void>;
  propertyForActiveCheck: keyof T;
  gridTemplateColumns: Array<number | 'auto' | '1fr'> = [];
  minWidth: number;
  sortClz: new (payload: TableSort<T>) => { type: string, payload: TableSort<T> };
  sortSelector: (state: MinaState) => TableSort<T>;
  rowClickCallback: (row: T) => void;

  tableLevel: number = 1;

  @ViewChild(CdkVirtualScrollViewport) private vs: CdkVirtualScrollViewport;
  @ViewChild('toTop') private toTop: ElementRef<HTMLDivElement>;
  private hiddenToTop: boolean = true;

  constructor(@Inject(DOCUMENT) private document: Document,
              private el: ElementRef) { super(); }

  init(): void {
    this.minWidth = this.minWidth || this.gridTemplateColumns.reduce((acc: number, curr: number | string) => acc + Number(curr), 0);
    this.listenToMenuChange();
    this.addGridTemplateColumnsInCssFile();
    this.listenToScrolling();
    this.listenToSortingChanges();
    this.detect();
  }

  ngAfterViewInit(): void {
    this.positionToTop();
  }

  private addGridTemplateColumnsInCssFile(): void {
    let value = `mina-table #table${this.tableLevel}.mina-table .row{grid-template-columns:`;
    this.gridTemplateColumns.forEach(v => value += typeof v === 'number' ? `${v}px ` : `${v} `);
    this.document.getElementById('table-style' + this.tableLevel).textContent = value + '}';
  }

  sortTable(sortBy: string | keyof T): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(this.sortClz, { sortBy: sortBy as keyof T, sortDirection });
  }

  scrollToTop(): void {
    this.vs.scrollToIndex(0, 'smooth');
    this.toTop.nativeElement.classList.add('hide');
    this.hiddenToTop = true;
  }

  scrollToElement(rowFinder: (row: T) => boolean): void {
    const topElements = Math.round(this.vs.elementRef.nativeElement.offsetHeight / 2 / this.rowSize) - 3;
    const jobIndex = this.rows.findIndex(rowFinder);
    this.vs.scrollToIndex(jobIndex - topElements);
  }

  get virtualScroll(): CdkVirtualScrollViewport {
    return this.vs;
  }

  private listenToScrolling(): void {
    this.vs.scrolledIndexChange
      .pipe(untilDestroyed(this), debounceTime(this.hiddenToTop ? 200 : 0))
      .subscribe(index => {
        if (index === 0) {
          this.toTop.nativeElement.classList.add('hide');
        } else {
          this.toTop.nativeElement.classList.remove('hide');
        }
        this.hiddenToTop = index === 0;
      });
  }

  private listenToSortingChanges(): void {
    if (!this.sortSelector) return;
    this.select(this.sortSelector, (sort: TableSort<T>) => {
      this.currentSort = sort;
      this.detect();
    });
  }

  private listenToMenuChange(): void {
    this.store.select(selectAppMenu)
      .pipe(
        untilDestroyed(this),
        filter(menu => menu.isMobile !== this.isMobile),
      )
      .subscribe((menu: AppMenu) => {
        this.isMobile = menu.isMobile;
        this.rowSize = menu.isMobile ? (26 * this.tableHeads.length + 10) : DESKTOP_ROW_HEIGHT;
        this.vs?.checkViewportSize();
        this.detect();
      });
  }

  private positionToTop(): void {
    if (!isMobile()) {
      return;
    }
    const rect = this.el.nativeElement.getBoundingClientRect();

    this.toTop.nativeElement.style.top = `${rect.top + rect.height - 60}px`;
    this.toTop.nativeElement.style.left = `${rect.left + rect.width - 60}px`;
  }

  onVsClick(event: MouseEvent): void {
    let target = event.target as any;
    let idx: number = null;
    while (target && target.getAttribute) {
      let attrValue = target.getAttribute('idx');
      if (attrValue) {
        attrValue = Number(attrValue);
        idx = attrValue;
      }
      if (hasValue(idx)) {
        break;
      }
      target = target.parentElement;
    }

    this.rowClickCallback(this.rows[idx]);
  }
}
