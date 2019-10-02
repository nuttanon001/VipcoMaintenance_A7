export interface ResueaColumn<Model> {
  columnField: string;
  columnName: string;
  canEdit?: boolean;
  cell: (row: Model) => any;
  width?: number;
  inputType?: InputType;
  max?: number;
}

export enum InputType {
  Number = 1,
  Text,
  Date,
  TextArea
}
