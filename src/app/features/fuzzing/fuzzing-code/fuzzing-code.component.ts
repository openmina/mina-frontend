import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';
import { selectFuzzingActiveFile, selectFuzzingActiveFileDetails } from '@fuzzing/fuzzing.state';
import { filter } from 'rxjs';
import { FuzzingLineCounter } from '@shared/types/fuzzing/fuzzing-line-counter.type';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'mina-fuzzing-code',
  templateUrl: './fuzzing-code.component.html',
  styleUrls: ['./fuzzing-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-50 h-100 border-left flex-column' },
})
export class FuzzingCodeComponent extends StoreDispatcher implements OnInit {

  file: FuzzingFile;
  fileDetails: FuzzingFileDetails;

  ngOnInit(): void {
    this.listenToFileChanges();
  }

  private listenToFileChanges(): void {
    const lookForChanges = () => {
      if (this.file && this.fileDetails) {
        this.detect();
      }
    };
    this.select(selectFuzzingActiveFile, (file: FuzzingFile) => {
      this.file = file;
      lookForChanges();
    }, filter(file => this.file !== file));
    this.select(selectFuzzingActiveFileDetails, (details: FuzzingFileDetails) => {
      this.fileDetails = details;
      // = {
      //   ...details,
      //   lines: details.lines.map((line) => ({
      //     line: line.line,
      //     counters: line.counters,
      //     prop: this.colorLineCounters(line.line, line.counters),
      //   })),
      // } as FuzzingFileDetails;
      lookForChanges();
    }, filter(file => this.fileDetails !== file));
  }
}
