import { formatDate } from '@angular/common';

function convertToReadableDate(value: number, format: string = 'HH:mm:ss.SSS, dd MMM yy'): string {
  return formatDate(value, format, 'en-US');
}

export const toReadableDate = (value: number, format?: string): string => convertToReadableDate(value, format);
