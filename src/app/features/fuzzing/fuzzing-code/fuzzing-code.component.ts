import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';
import { selectFuzzingActiveFile, selectFuzzingActiveFileDetails, selectFuzzingUrlType } from '@fuzzing/fuzzing.state';
import { debounceTime, filter, fromEvent, take, tap, zip } from 'rxjs';
import { Routes } from '@shared/enums/routes.enum';
import { Router } from '@angular/router';
import { FuzzingGetFileDetails } from '@fuzzing/fuzzing.actions';
import { untilDestroyed } from '@ngneat/until-destroy';
import { MinaTooltipDirective } from '@shared/directives/mina-tooltip.directive';
import { Clipboard } from '@angular/cdk/clipboard';
import { getMergedRoute } from '@shared/router/router-state.selectors';
import { MergedRoute } from '@shared/router/merged-route';

@Component({
  selector: 'mina-fuzzing-code',
  templateUrl: './fuzzing-code.component.html',
  styleUrls: ['./fuzzing-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'h-100 border-left flex-column' },
})
export class FuzzingCodeComponent extends StoreDispatcher implements OnInit, AfterViewInit {

  /*
  * TODO
  *  X reset scroll position on file change
  *  X auto scroll table to active file
  *  - scroll to active line of code
  *  X add ocaml/rust switch with state keeping
  *  X add code highlight toggling
  *  X add countings to the highlights in the code
  *  - add search for code
  * */


  file: FuzzingFile;
  fileDetails: FuzzingFileDetails;
  codeHighlighted: boolean = true;
  urlTypeStr: 'OCaml' | 'Rust';
  readonly link: string = `${window.location.origin}${window.location.pathname}?line=`;

  private urlType: 'ocaml' | 'rust';
  private popup: HTMLDivElement = document.getElementById('mina-tooltip') as HTMLDivElement;
  private lineToScroll: number;
  @ViewChild('codeHolder') private codeHolder: ElementRef<HTMLDivElement>;

  constructor(private router: Router,
              private clipboard: Clipboard) { super(); }

  ngOnInit(): void {
    this.listenToFileChanges();
    this.listenToRouteType();
  }

  ngAfterViewInit(): void {
    this.listenToMouseMove();
    this.listenToRouteChange();
  }

  closeSidePanel(): void {
    this.router.navigate([Routes.FUZZING, this.urlType], { queryParamsHandling: 'merge' });
    this.dispatch(FuzzingGetFileDetails, undefined);
  }

  private listenToRouteType(): void {
    this.select(selectFuzzingUrlType, (type: 'ocaml' | 'rust') => {
      this.urlType = type;
      this.urlTypeStr = type === 'ocaml' ? 'OCaml' : 'Rust';
    });
  }

  private listenToFileChanges(): void {
    zip(
      this.store.select(selectFuzzingActiveFile).pipe(
        filter(file => this.file !== file),
      ),
      this.store.select(selectFuzzingActiveFileDetails).pipe(
        filter(file => this.fileDetails !== file),
      ),
    ).pipe(untilDestroyed(this))
      .subscribe(([file, details]) => {
        this.file = file;
        this.fileDetails = details;
        this.codeHolder.nativeElement.scrollTo(0, 0);
        if (this.lineToScroll) {
          this.detect();
          this.codeHolder.nativeElement.scrollTo(0, (Number(this.lineToScroll) - 1) * 24);
          delete this.lineToScroll;
        }
        this.detect();
      });
  }

  toggleCodeHighlighting(): void {
    this.codeHighlighted = !this.codeHighlighted;
  }

  private listenToMouseMove(): void {
    fromEvent(this.codeHolder.nativeElement, 'mousemove').pipe(
      untilDestroyed(this),
      tap(() => MinaTooltipDirective.hideTooltip(this.popup)),
      debounceTime(400),
    ).subscribe((ev: Event) => {
      const target = ev.target as HTMLSpanElement;
      if (target.hasAttribute('c')) {
        MinaTooltipDirective.showTooltip(this.popup, target, 'Hits: ' + target.getAttribute('c'), 500);
      }
    });
  }

  copyLineLink(lineIndex: number): void {
    const link = `${window.location.origin}${window.location.pathname}?line=${lineIndex}`;
    this.clipboard.copy(link);
  }

  private listenToRouteChange(): void {
    this.select(getMergedRoute, (route: MergedRoute) => {
      const line = route.queryParams['line'];
      if (line) {
        this.lineToScroll = line;
      }
    }, take(1));
  }
}
