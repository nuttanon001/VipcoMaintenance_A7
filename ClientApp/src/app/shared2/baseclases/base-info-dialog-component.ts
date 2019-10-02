import { OnInit, Output, Input, EventEmitter } from "@angular/core";
import { BaseModel } from "../basemode/base-model.model";
import { FieldConfig, GroupField, ReturnValue } from "../dynamic-form/field-config.model";

export abstract class BaseInfoDialogComponent<Model extends BaseModel>
  implements OnInit{

  constructor(
  ) { }

  //Parameter
  @Input() InfoValue: Model;
  @Output() SubmitOrCancel: EventEmitter<{ data: Model | undefined, force: boolean }> = new EventEmitter<{ data: Model | undefined, force: boolean }>();
  regConfig: Array<FieldConfig>;
  groupConfig: Array<GroupField>;
  denySave: boolean = false;
  isValid: boolean = false
  step = 0;
  /*
   * Methods
   */
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }

  endStep() {
    if (this.isValid) {
      this.SubmitOrCancel.emit({ data: this.InfoValue, force: true });
    }
  }

  ngOnInit(): void {
    if (this.InfoValue) {
      if (this.InfoValue) {
        this.denySave = this.InfoValue.ReadOnly;
      }
      this.buildForm();
    }
  }

  // build form
  abstract buildForm(): void;

  // On submit
  onSubmit(InfoValue?: Model): void {
    if (this.InfoValue) {
      if (this.isValid) {
        this.InfoValue = InfoValue;
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    }
  }

  // submit dynamic form
  submitDynamicForm(InfoValue?: ReturnValue<Model>): void {
    if (InfoValue) {
      if (!this.denySave) {
        let template = InfoValue.value;
        // Template
        for (let key in template) {
          this.InfoValue[key] = template[key];
        }
        this.isValid = InfoValue.valid;
        this.SubmitOrCancel.emit({ data: this.InfoValue, force: false });
      }
    }
  }

  // On cancel
  onCancel(): void {
    this.SubmitOrCancel.emit(undefined);
  }
}
