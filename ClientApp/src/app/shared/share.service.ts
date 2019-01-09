import { Injectable } from '@angular/core';
import { Workgroup } from "../work-groups/shared/workgroup.model";
import { Observable } from 'rxjs/Observable';

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
    return Observable.create(observer => {
      observer.next(this.WorkGroup);
      observer.complete();
    });
  }
  // Set WorkGroup
  setWorkGroup(workGroup: Workgroup): void {
    this.WorkGroup = workGroup;
  }
}
