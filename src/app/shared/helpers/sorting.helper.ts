import { SortDirection, TableSort } from '@shared/types/shared/table-sort.type';

export function sort<T>(inpArray: T[], sort: TableSort, strings: string[]): T[] {
  const sortProperty = sort.sortBy;
  const isStringSorting = strings.includes(sortProperty);
  const array: T[] = [...inpArray];
  const toBeSorted = isStringSorting ? array : array.filter(e => e[sortProperty] !== undefined && e[sortProperty] !== null);
  const toNotBeSorted = isStringSorting ? [] : array.filter(e => e[sortProperty] === undefined || e[sortProperty] === null);

  if (isStringSorting) {
    const stringSort = (o1: T, o2: T) =>
      sort.sortDirection === SortDirection.DSC
        ? o2[sortProperty] > o1[sortProperty] ? 1 : -1
        : o1[sortProperty] > o2[sortProperty] ? 1 : -1;
    toBeSorted.sort(stringSort);
  } else {
    const numberSort = (o1: T, o2: T): number => {
      const o2Sort = o2[sortProperty] ?? Number.MAX_VALUE;
      const o1Sort = o1[sortProperty] ?? Number.MAX_VALUE;
      return sort.sortDirection === SortDirection.DSC
        ? o2Sort - o1Sort
        : o1Sort - o2Sort;
    };
    toBeSorted.sort(numberSort);
  }

  return [...toBeSorted, ...toNotBeSorted];
}
