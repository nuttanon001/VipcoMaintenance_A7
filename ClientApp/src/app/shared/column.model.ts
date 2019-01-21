export interface MyPrimengColumn {
  field?: string;
  header?: string;
  style?: string;
  width?: number;
  type?: ColumnType;
  colspan?: number;
  rowspan?: number;
  canSort?: boolean;
}

export enum ColumnType {
  Show = 1,
  Option1,
  Option2,
  Hidder
}
