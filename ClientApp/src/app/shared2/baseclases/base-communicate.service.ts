import { Subject, BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseCommunicateService<Model> {

  // Observable string sources
  private ParentSource = new Subject<Model>();
  private EditChileSource = new Subject<Model>();

  // Observable string streams
  ToParent$ = this.ParentSource.asObservable();
  toChildEdit$ = this.EditChileSource.asObservable();

  // Service message commands
  toParent(ValueFromEdit: Model): void {
    this.ParentSource.next(ValueFromEdit);
  }

  toChildEdit(ValueToEdit?: Model): void {
    this.EditChileSource.next(ValueToEdit);
  }
}
