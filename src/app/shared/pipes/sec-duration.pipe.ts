import { Pipe, PipeTransform } from '@angular/core';
import { MICROSEC_IN_1_SEC, MILLISEC_IN_1_SEC, NANOSEC_IN_1_SEC } from '@shared/constants/unit-measurements';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'secDuration',
})
export class SecDurationPipe implements PipeTransform {

  transform(value: number, color: boolean = false): string | number {
    let response;

    if (!value) {
      return value;
    }

    if (value >= 1) {
      response = SecDurationPipe.format(value) + 's';
    } else if (value >= 0.001) {
      response = SecDurationPipe.format(value * MILLISEC_IN_1_SEC) + 'ms';
    } else if (value >= 0.000001) {
      response = SecDurationPipe.format(value * MICROSEC_IN_1_SEC) + 'μs';
    } else {
      response = SecDurationPipe.format(value * NANOSEC_IN_1_SEC) + 'ns';
    }

    if (!color) {
      return response;
    }

    if (value >= 1) {
      return `<span class="error">${response}</span>`;
    } else if (value >= 0.3) {
      return `<span class="orange">${response}</span>`;
    } else if (value >= 0.1) {
      return `<span class="warn">${response}</span>`;
    }
    return response;
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }

}
