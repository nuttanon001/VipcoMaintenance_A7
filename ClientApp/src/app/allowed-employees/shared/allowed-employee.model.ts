import { BaseModel } from 'src/app/shared2/basemode/base-model.model';

export interface AllowedEmployee extends BaseModel {
  EmpCode?: string;
  SubLevel?: number;
  NameThai?: string;
}
