import { Pipe, PipeTransform } from '@angular/core';
import { toReadableDate } from '@shared/helpers/date.helper';
import { ONE_MILLION } from '@shared/constants/unit-measurements';

@Pipe({
  name: 'readableDate',
})
export class ReadableDatePipe implements PipeTransform {
  transform(value: number, format?: string): string {
    if (value > 1e12) {
      value = value / ONE_MILLION;
    }

    return value ? toReadableDate(value, format) : '-';
  }
}
