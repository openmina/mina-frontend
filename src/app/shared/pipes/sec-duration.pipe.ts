import { Pipe, PipeTransform } from '@angular/core';
import { MICROSEC_IN_1_SEC, MILLISEC_IN_1_SEC, NANOSEC_IN_1_SEC } from '@shared/constants/unit-measurements';
import { formatNumber } from '@angular/common';
import { hasValue } from '@shared/helpers/values.helper';

interface SecDurationConfigDefinition {
  severe: number;
  warn: number;
  default: number;
  color: boolean;
  onlySeconds: boolean;
  undefinedAlternative: string | number | undefined;
  colors: [string, string, string];
}

export type SecDurationConfig = Partial<SecDurationConfigDefinition>;
export const SEC_CONFIG_DEFAULT_PALETTE: [string, string, string] = ['warn', 'orange', 'error'];
export const SEC_CONFIG_GRAY_PALETTE: [string, string, string] = ['tertiary', 'secondary', 'primary'];

const baseConfig: SecDurationConfig = {
  severe: 1,
  warn: 0.3,
  default: 0.1,
  color: false,
  onlySeconds: false,
  colors: SEC_CONFIG_DEFAULT_PALETTE,
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
    } else if (!hasValue(config.colors)) {
      config.colors = SEC_CONFIG_DEFAULT_PALETTE;
    }

    if (value >= config.severe) {
      return `<span class="${config.colors[2]}">${response}</span>`;
    } else if (value >= config.warn) {
      return `<span class="${config.colors[1]}">${response}</span>`;
    } else if (value >= config.default) {
      return `<span class="${config.colors[0]}">${response}</span>`;
    }
    return response;
  }

  private static format(value: number): string {
    return formatNumber(value, 'en-US', '1.0-2');
  }

}
