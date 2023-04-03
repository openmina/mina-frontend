import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { TableHeadSorting } from '@shared/types/shared/table-head-sorting.type';
import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { Router } from '@angular/router';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { selectFuzzingActiveFile, selectFuzzingFiles, selectFuzzingFilesSorting } from '@fuzzing/fuzzing.state';
import { FuzzingGetFileDetails, FuzzingSort } from '@fuzzing/fuzzing.actions';
import { filter, take } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';

@Component({
  selector: 'mina-fuzzing-table',
  templateUrl: './fuzzing-table.component.html',
  styleUrls: ['./fuzzing-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-column h-100 w-50' },
})
export class FuzzingTableComponent extends StoreDispatcher implements OnInit {

  readonly itemSize: number = 36;

  readonly tableHeads: TableHeadSorting<FuzzingFile>[] = [
    { name: 'coverage' },
    { name: 'path' },
  ];

  files: FuzzingFile[] = [];
  activeFile: FuzzingFile;
  currentSort: TableSort<FuzzingFile>;

  private pathFromRoute: string;

  constructor(private router: Router) { super(); }

  ngOnInit(): void {
    this.listenToRouteChange();
    this.listenToSortingChanges();
    this.listenToFiles();
    this.listenToActiveFile();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      if (route.params['file'] && this.files.length === 0) {
        this.pathFromRoute = route.params['file'];
      }
    }, take(1));
  }


  private listenToFiles(): void {
    this.select(selectFuzzingFiles, (files: FuzzingFile[]) => {
      this.files = files;
      if (this.pathFromRoute) {
        const payload = files.find(file => file.path === this.pathFromRoute);
        if (payload) {
          this.dispatch(FuzzingGetFileDetails, payload);
          delete this.pathFromRoute;
        }
      }
      this.detect();
    });
  }

  private listenToActiveFile(): void {
    this.select(selectFuzzingActiveFile, (file: FuzzingFile) => {
      this.activeFile = file;
      this.detect();
    }, filter(file => this.activeFile !== file));
  }

  private listenToSortingChanges(): void {
    this.select(selectFuzzingFilesSorting, sort => {
      this.currentSort = sort;
      this.detect();
    });
  }

  sortTable(sortBy: string): void {
    const sortDirection = sortBy !== this.currentSort.sortBy
      ? this.currentSort.sortDirection
      : this.currentSort.sortDirection === SortDirection.ASC ? SortDirection.DSC : SortDirection.ASC;
    this.dispatch(FuzzingSort, { sortBy: sortBy as keyof FuzzingFile, sortDirection });
  }

  onRowClick(file: FuzzingFile): void {
    if (this.activeFile?.path !== file.path) {
      this.activeFile = file;
      this.dispatch(FuzzingGetFileDetails, file);
    }
    this.router.navigate([Routes.FUZZING, file.path]);
  }
}
