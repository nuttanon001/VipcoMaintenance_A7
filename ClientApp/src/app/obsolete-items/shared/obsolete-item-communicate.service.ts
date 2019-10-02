import { Injectable } from '@angular/core';
import { ObsoleteItem } from './obsolete-item.model';
import { BaseCommunicateService } from 'src/app/shared2/baseclases/base-communicate.service';

@Injectable()
export class ObsoleteItemCommunicateService
  extends BaseCommunicateService<ObsoleteItem> {

  constructor() { super(); }
}
