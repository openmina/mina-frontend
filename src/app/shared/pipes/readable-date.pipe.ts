import { Pipe, PipeTransform } from '@angular/core';
import { toReadableDate } from '@shared/helpers/date.helper';

@Pipe({
  name: 'readableDate'
})
export class ReadableDatePipe implements PipeTransform {
  transform(value: number, format?: string): string {
    return value ? toReadableDate(value, format) : '-';
  }
}
