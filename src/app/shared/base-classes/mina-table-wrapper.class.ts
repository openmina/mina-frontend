import { Directive, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { TableColumnList } from '@shared/types/shared/table-head-sorting.type';
import { MinaTableComponent } from '@shared/components/mina-table/mina-table.component';

@Directive()
export abstract class MinaTableWrapper<T extends object> extends StoreDispatcher implements OnInit {

  protected abstract readonly tableHeads: TableColumnList<T>;

  @ViewChild('rowTemplate') protected rowTemplate: TemplateRef<T>;
  @ViewChild('minaTable', { read: ViewContainerRef }) protected containerRef: ViewContainerRef;

  public table: MinaTableComponent<T>;

  async ngOnInit(): Promise<void> {
    await import('@shared/components/mina-table/mina-table.component').then(c => {
      this.table = this.containerRef.createComponent(c.MinaTableComponent<T>).instance;
      this.table.tableHeads = this.tableHeads;
      this.table.rowTemplate = this.rowTemplate;
      this.table.rowClickCallback = (row: T) => this.onRowClick(row);
      this.setupTable();
      this.table.init();
    });
  }

  protected abstract setupTable(): void;

  protected onRowClick(row: T): void { }
}
