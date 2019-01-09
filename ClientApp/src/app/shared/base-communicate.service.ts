import { Subject, BehaviorSubject, Observable } from 'rxjs';

export abstract class BaseCommunicateService<Model> {

  // Observable string sources
  private ParentSource = new Subject<[Model, boolean]>();
  private EditChileSource = new Subject<Model>();

  // Observable string streams
  ToParent$ = this.ParentSource.asObservable();
  toChildEdit$ = this.EditChileSource.asObservable();

  // Service message commands
  toParent(ValueFromEdit: [Model, boolean]): void {
    this.ParentSource.next(ValueFromEdit);
  }

  toChildEdit(ValueToEdit?: Model): void {
    this.EditChileSource.next(ValueToEdit);
  }
}
