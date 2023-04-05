import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FuzzingClose, FuzzingGetFiles } from '@fuzzing/fuzzing.actions';
import { HorizontalResizableContainerComponent } from '@shared/components/horizontal-resizable-container/horizontal-resizable-container.component';
import { FuzzingTableComponent } from '@fuzzing/fuzzing-table/fuzzing-table.component';
import { selectFuzzingActiveFile } from '@fuzzing/fuzzing.state';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { AppChangeSubMenus } from '@app/app.actions';
import { Routes } from '@shared/enums/routes.enum';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';
import { take } from 'rxjs';
import { removeParamsFromURL } from '@shared/helpers/router.helper';

@Component({
  selector: 'mina-fuzzing',
  templateUrl: './fuzzing.component.html',
  styleUrls: ['./fuzzing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex-row h-100' },
})
export class FuzzingComponent extends StoreDispatcher implements OnInit {

  ngOnInit(): void {
    this.dispatch(AppChangeSubMenus, [Routes.OCAML, Routes.RUST]);
    this.listenToRouteChange();
    this.listenToActiveRowChange();
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      const urlType = removeParamsFromURL(route.url).split('/')[2] as 'ocaml' | 'rust';
      this.dispatch(FuzzingGetFiles, { urlType });
    }, take(1));
  }

  isActiveRow: boolean;

  private removedClass: boolean;

  @ViewChild(FuzzingTableComponent, { read: ElementRef }) private tableRef: ElementRef<HTMLElement>;
  @ViewChild(HorizontalResizableContainerComponent, { read: ElementRef }) private horizontalResizableContainer: ElementRef<HTMLElement>;

  toggleResizing(): void {
    this.tableRef.nativeElement.classList.toggle('no-transition');
  }

  onWidthChange(width: number): void {
    this.horizontalResizableContainer.nativeElement.style.right = (width * -1) + 'px';
    this.tableRef.nativeElement.style.width = `calc(100% - ${width}px)`;
  }

  private listenToActiveRowChange(): void {
    this.select(selectFuzzingActiveFile, (row: FuzzingFile) => {
      if (row && !this.isActiveRow) {
        this.isActiveRow = true;
        if (!this.removedClass) {
          this.removedClass = true;
          this.horizontalResizableContainer.nativeElement.classList.remove('no-transition');
        }
        this.detect();
      } else if (!row && this.isActiveRow) {
        this.isActiveRow = false;
        this.detect();
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dispatch(FuzzingClose);
  }
}
