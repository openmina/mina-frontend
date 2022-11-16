import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateMid',
})
export class TruncateMidPipe implements PipeTransform {

  transform(value: string, firstSlice: number = 6, secondSlice: number = 6): string {
    if (!value) {
      return '';
    }
    return value.length > (firstSlice + 7) ? value.slice(0, firstSlice) + '...' + value.slice(value.length - secondSlice) : value;
  }

}
