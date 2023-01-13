import { Pipe, PipeTransform } from '@angular/core';
import { MICROSEC_IN_1_SEC, MILLISEC_IN_1_SEC, NANOSEC_IN_1_SEC } from '@shared/constants/unit-measurements';
import { formatNumber } from '@angular/common';

interface SecDurationConfigDefinition {
  red: number;
  orange: number;
  yellow: number;
  color: boolean;
  onlySeconds: boolean;
  undefinedAlternative: string | number | undefined;
}

export type SecDurationConfig = Partial<SecDurationConfigDefinition>;

const baseConfig: SecDurationConfig = {
  red: 1,
  orange: 0.3,
  yellow: 0.1,
  color: false,
  onlySeconds: false,
};

@Pipe({
  name: 'secDuration',
})
export class SecDurationPipe implements PipeTransform {

  transform(value: number, config: SecDurationConfig = baseConfig): string | number {
    let response;

    if (!value) {
      return value === 0 ? `${value}s` : config.undefinedAlternative !== undefined ? config.undefinedAlternative : value;
    }

    if (value >= 1 || config.onlySeconds || value < 0) {
      response = SecDurationPipe.format(value) + 's';
    } else if (value >= 0.001) {
      response = SecDurationPipe.format(value * MILLISEC_IN_1_SEC) + 'ms';
    } else if (value >= 0.000001) {
      response = SecDurationPipe.format(value * MICROSEC_IN_1_SEC) + 'μs';
    } else {
      response = SecDurationPipe.format(value * NANOSEC_IN_1_SEC) + 'ns';
    }

    if (!config.color) {
      return response;
    }

    if (value >= config.red) {
      return `<span class="error">${response}</span>`;
    } else if (value >= config.orange) {
      return `<span class="orange">${response}</span>`;
    } else if (value >= config.yellow) {
      return `<span class="warn">${response}</span>`;
    }
    return response;
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }

}
