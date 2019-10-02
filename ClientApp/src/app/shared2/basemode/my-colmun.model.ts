export interface MyColumn {
  field?: string;
  header?: string;
  style?: string;
  width?: number;
  type?: ColumnType;
  colspan?: number;
  rowspan?: number;
  canSort?: boolean;
  format?: Format;
}

export enum Format {
  Number = 1,
  Date
}


export enum ColumnType {
  Show = 1,
  Hidder,
  Option,
  Click,
}

