import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {

  transform(value: number, suffix: string = 's'): string {
    return value === 1 ? '' : suffix;
  }

}
