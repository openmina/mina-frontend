export interface TableHeadSorting<T = any> {
  name: string | keyof T;
  sort?: keyof T;
}
