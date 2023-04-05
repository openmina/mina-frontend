import { Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { HttpClient } from '@angular/common/http';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';
import { FuzzingLineCounter } from '@shared/types/fuzzing/fuzzing-line-counter.type';

@Injectable({
  providedIn: 'root',
})
export class FuzzingService {

  constructor(private http: HttpClient) { }

  getFiles(type: 'ocaml' | 'rust'): Observable<FuzzingFile[]> {
    return this.http.get<any[]>('assets/reports/' + type + 'index.json').pipe(delay(100))
      .pipe(
        map((files: any[]) => files.map((file: any) => ({
          name: file[0],
          coverage: file[1],
          path: file[2],
        }))),
      );
  }

  getFileDetails(name: string): Observable<FuzzingFileDetails> {
    return this.http.get<any>(`assets/reports/${name}`).pipe(delay(100))
      .pipe(
        map((file: any) => ({
          filename: file.filename,
          executedLines: file.lines.filter((line: any) => line.counters[0]).length,
          lines: file.lines.map((line: any) => {
            const counters = line.counters.map((counter: any) => ({
              colStart: counter.col_start,
              colEnd: counter.col_end,
              count: Math.abs(counter.count),
            }));
            return {
              line: line.line,
              lineColor: this.getLineColor(line),
              html: this.colorLineCounters(line.line, counters),
              lineHits: counters.length ? Math.max(...counters.map((counter: any) => counter.count)) : undefined,
              counters,
            };
          }),
        } as FuzzingFileDetails)),
      );
  }

  private getLineColor(line: any): string {
    if (line.counters.length === 0) {
      return line;
    }

    let lineColor = 'aware';

    for (const counter of line.counters) {
      if (counter.count > 0) {
        if (lineColor === 'warn') {
          lineColor = 'aware';
          break;
        }
        lineColor = 'success';
      } else {
        if (lineColor === 'success') {
          lineColor = 'aware';
          break;
        }
        lineColor = 'warn';
      }
    }
    return lineColor;
  }

  private colorLineCounters(line: string, counters: FuzzingLineCounter[]): string {
    let result = '';
    if (counters.length === 0) {
      return line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    for (let i = 0; i < line.length; i++) {
      const column = i;
      const c = line.charAt(i);
      const counter = counters.find((counter: FuzzingLineCounter) => counter.colStart <= column && counter.colEnd >= column);

      if (counter && column === counter.colStart) {
        const colorCode: string = `var(--${counter.count === 0 ? 'warn' : 'success'}-secondary)`;
        result += `<span style="color:var(--base-primary);background:${colorCode}" h="${counter.count}">`;
      }

      result += c === ' ' ? '&nbsp;' : (c === '<' ? '&lt;' : c === '>' ? '&gt;' : c);

      if (counter && column === counter.colEnd) {
        result += '</span>';
      }
    }

    return result;
  }
}
