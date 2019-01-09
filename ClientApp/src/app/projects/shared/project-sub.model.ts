import { BaseModel } from "../../shared/base-model.model";

export interface ProjectSub extends BaseModel {
  ProjectCodeDetailId: number;
  ProjectCodeDetailCode?: string;
  Description?: string;
  ProjectCodeMasterId?: number;
  //ViewModel
  FullProjectLevelString?: string;
}
