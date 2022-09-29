import * as moment from 'moment';

function convertToReadableDate(value: number, format: string = 'HH:mm:ss.SSS, DD MMM YY'): string {
  return moment(Math.ceil(value)).format(format);
}

export const toReadableDate = (value: number, format?: string): string => convertToReadableDate(value, format);
