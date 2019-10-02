import { Injectable } from '@angular/core';
// import { Workgroup } from "../work-groups/shared/workgroup.model";
import { Observable, Subject } from 'rxjs';
import { SharedData } from './shared-data.model';

@Injectable({
  providedIn:"root"
})
export class ShareService {

  constructor() { }
  private ParentSource = new Subject<SharedData>();
  private ChileSoure = new Subject<SharedData>();

  // Observable string streams
  ToParent$ = this.ParentSource.asObservable();
  toChild$ = this.ChileSoure.asObservable();

  // Service message commands
  toParent(data: SharedData): void {
    this.ParentSource.next(data);
  }
  toChild(data?: SharedData): void {
    this.ChileSoure.next(data);
  }
  // Remove
  removeChildData() {
    this.ChileSoure.next();
  }
  removeParentData() {
    this.ParentSource.next();
  }
 
}
