export interface User {
  UserId: number;
  UserName?: string;
  PassWord?: string;
  MailAddress?: string;
  LevelUser: number;
  Creator?: string;
  CreateDate?: Date;
  Modifyer?: string;
  ModifyDate?: Date;
  EmpCode?: string;
  // ViewModel
  NameThai?: string;
  Token?: string;
  SubLevel?: number;
}
