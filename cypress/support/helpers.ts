import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';
import { hasValue } from '@shared/helpers/values.helper';

export function truncateMid(value: string, firstSlice: number = 6, secondSlice: number = 6): string {
  if (!value) {
    return '';
  }
  return value.length > (firstSlice + secondSlice) ? value.slice(0, firstSlice) + '...' + value.slice(value.length - secondSlice) : value;
}

export function sort<T = any>(inpArray: T[], sort: TableSort<T>, strings: Array<keyof T>, sortNulls: boolean = false): T[] {
  const sortProperty = sort.sortBy;
  const isStringSorting = strings.includes(sortProperty);
  const array: T[] = [...inpArray];

  let toBeSorted: T[];
  let toNotBeSorted: T[] = [];
  if (sortNulls) {
    toBeSorted = array;
  } else {
    toBeSorted = isStringSorting ? array : array.filter(e => e[sortProperty] !== undefined && e[sortProperty] !== null);
    toNotBeSorted = isStringSorting ? [] : array.filter(e => e[sortProperty] === undefined || e[sortProperty] === null);
  }

  if (isStringSorting) {
    const stringSort = (o1: T, o2: T) => {
      const s2 = (o2[sortProperty] || '') as string;
      const s1 = (o1[sortProperty] || '') as string;
      return sort.sortDirection === SortDirection.DSC
        ? (s2).localeCompare(s1)
        : s1.localeCompare(s2);
    };
    toBeSorted.sort(stringSort);
  } else {
    const numberSort = (o1: T, o2: T): number => {
      const o2Sort = (hasValue(o2[sortProperty]) ? o2[sortProperty] : Number.MAX_VALUE) as number;
      const o1Sort = (hasValue(o1[sortProperty]) ? o1[sortProperty] : Number.MAX_VALUE) as number;
      return sort.sortDirection === SortDirection.DSC
        ? o2Sort - o1Sort
        : o1Sort - o2Sort;
    };
    toBeSorted.sort(numberSort);
  }

  return [...toBeSorted, ...toNotBeSorted];
}
