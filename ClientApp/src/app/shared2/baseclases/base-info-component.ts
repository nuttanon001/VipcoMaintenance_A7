// angular core
import { OnInit, OnDestroy, ViewContainerRef } from "@angular/core";
// rxjs
import { Subscription } from "rxjs";
import { BaseRestService } from "./base-rest.service";
import { BaseCommunicateService } from "./base-communicate.service";
import { BaseModel } from "../basemode/base-model.model";
import { FieldConfig, GroupField, ReturnValue } from "../dynamic-form/field-config.model";

export abstract class BaseInfoComponent<
  Model extends BaseModel,
  Service extends BaseRestService<Model>,
  ServiceCommunicate extends BaseCommunicateService<Model>>
  implements OnInit, OnDestroy {
  /*
   * Constructor
   */
  constructor(
    protected service: Service,
    protected communicateService: ServiceCommunicate,
  ) { }

  /*
   * Parameter
   */
  InfoValue: Model;
  regConfig: Array<FieldConfig>;
  groupConfig: Array<GroupField>;
  subscription: Subscription;
  subscription2: Subscription;
  denySave: boolean = false;
  isValid: boolean = false;
  isCopying: boolean = false;
  /*
   * Methods
   */
  // on hook component
  ngOnInit(): void {
    this.subscription = this.communicateService.toChildEdit$.subscribe(
      (InfoValue: Model) => {
        if (InfoValue) {
          this.denySave = InfoValue.ReadOnly;
        }
        this.onGetDataByKey(InfoValue);
      });
    // subscription
    this.FromComponents();
  }
  // on hook component
  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

  // on get data by key
  abstract onGetDataByKey(InfoValue: Model): void;
  // build form
  abstract buildForm(): void;
  // on valid data
  SetCommunicatetoParent(): void {
    if (this.isValid) {
      this.communicateService.toParent(this.InfoValue);
      return;
    }
    this.communicateService.toParent(undefined);
  }

  // submit form dynamic
  abstract submitDynamicForm(InfoValue?: ReturnValue<Model>): void;
  // event from component
  abstract FromComponents(): void;
}
