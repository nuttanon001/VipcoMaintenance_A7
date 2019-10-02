import { BaseModel } from 'src/app/shared2/basemode/base-model.model';

export interface AttachFile extends BaseModel {
  AttachFileId?: number;
  FileName?: string;
  FileAddress?: string;
  Size?: number;
  NotSave?: boolean;
  RemoveIndex?: number;
}
