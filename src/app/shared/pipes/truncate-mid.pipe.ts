import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateMid'
})
export class TruncateMidPipe implements PipeTransform {

  transform(value: string, ):string {
    return value.length > 22 ? value.slice(0, 15) + '...' + value.slice(value.length - 6) : value;
  }

}
