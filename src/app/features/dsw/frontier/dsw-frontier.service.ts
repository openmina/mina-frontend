import { Injectable } from '@angular/core';
import { DswFrontierLog, DswFrontierLogLevels } from '@shared/types/dsw/frontier/dsw-frontier-log.type';
import { Observable, of } from 'rxjs';
import { toReadableDate } from '@shared/helpers/date.helper';

@Injectable({
  providedIn: 'root',
})
export class DswFrontierService {

  constructor() { }

  getDswFrontierLogs(): Observable<DswFrontierLog[]> {
    return of([
      { id: 1, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 2, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 3, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 4, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 5, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 6, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.BEST_TIP, message: 'New best tip found' },
      { id: 7, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.MISSING, message: 'Missing block' },
      { id: 8, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.MISSING, message: 'Missing block' },
      { id: 9, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.MISSING, message: 'Missing block' },
      { id: 10, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.MISSING, message: 'Missing block' },
      { id: 11, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.DOWNLOADING, message: 'Downloading block' },
      { id: 12, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.DOWNLOADING, message: 'Downloading block' },
      { id: 13, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.DOWNLOADING, message: 'Downloading block' },
      { id: 14, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.DOWNLOADING, message: 'Downloading block' },
      { id: 15, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.DOWNLOADING, message: 'Downloading block' },
      { id: 16, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLYING, message: 'Applying block' },
      { id: 17, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLYING, message: 'Applying block' },
      { id: 18, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 19, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 20, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 21, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 22, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 23, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 24, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 25, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 26, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 27, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 28, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 29, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
      { id: 30, date: toReadableDate(Date.now()), level: DswFrontierLogLevels.APPLIED, message: 'Applied block' },
    ]);
  }
}
