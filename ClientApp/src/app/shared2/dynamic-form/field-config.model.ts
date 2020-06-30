export interface Validator {
  name: ValidatorField;
  validator: any;
  message: string;
}

export interface GroupField {
  name?: string;
  title?: string;
}

export interface FieldConfig {
  label?: string;
  name?: string;
  inputType?: inputType;
  options?: OptionField[];
  collections?: any;
  type: typeField;
  value?: any;
  disabled?: boolean;
  hidden?: boolean;
  group?: string;
  readonly?: boolean;
  continue?: boolean;
  vertival?: boolean;
  prefix?: boolean;
  text_perfix?: string;
  validations?: Validator[];
}

export interface ReturnValue<Model> {
  value?: Model;
  valid?: boolean;
}

export interface OptionField {
  label?: string;
  value?: any;
}

export enum inputType {
  text = 'text',
  number = 'number',
  time = 'time',
  mail = 'mail',
}

export enum typeField {
  textarea = 'textarea',
  input = 'input',
  inputclick = 'inputclick',
  button = 'button',
  select = 'select',
  date = 'date',
  dateevent = 'dateevent',
  radiobutton = 'radiobutton',
  checkbox = 'checkbox',
  autocomplete = 'autocomplete',
  empty = 'empty'
}

export enum ValidatorField {
  min = 'min',
  max = 'max',
  required = 'required',
  requiredTrue = 'requiredTrue', // This validator is commonly used for required checkboxes.
  email = 'email',
  minLength = 'minLength',
  maxLength = 'maxLength',
  pattern = 'pattern',
  nullValidator = 'nullValidator', // Validator that performs no operation.
}
