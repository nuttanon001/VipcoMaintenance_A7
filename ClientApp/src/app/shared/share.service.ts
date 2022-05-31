import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Workgroup } from "../work-groups/shared/workgroup.model";

@Injectable()
export class ShareService {
  WorkGroup: Workgroup;

  constructor() {
    this.WorkGroup = {
      WorkGroupId: 1
    };
  }

  // Get WorkGroup
  getWorkGroup(): Observable<Workgroup> {
    return of(this.WorkGroup);
  }
  // Set WorkGroup
  setWorkGroup(workGroup: Workgroup): void {
    this.WorkGroup = workGroup;
  }
}
