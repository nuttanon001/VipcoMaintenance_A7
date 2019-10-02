import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from "@angular/forms";
import { FieldConfig, Validator, GroupField, ReturnValue } from "../field-config.model";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  exportAs: "dynamicGroupForm",
  selector: "dynamic-group-form",
  template: `
  <form [formGroup]="form" (submit)="onSubmit($event)">
    <mat-accordion class="headers-align">
        <!--Expansion1-->
        <mat-expansion-panel hideToggle="true" *ngFor="let group of groups;">
          <!--Header-->
          <mat-expansion-panel-header>
            <mat-panel-title>
              <strong>{{group.title}}</strong>
            </mat-panel-title>
          </mat-expansion-panel-header>
          <ng-container *ngFor="let field of filterField(group.name);">
            <ng-container *ngIf="!field.hidden" dynamicField [field]="field" [group]="form">
            </ng-container>
          </ng-container>
        </mat-expansion-panel>
    </mat-accordion>
  </form>
  `,
  styles: []
})
export class DynamicGroupFormComponent implements OnInit {
  @Input() fields: FieldConfig[] = [];
  @Input() groups: GroupField[] = [];
  @Output() submit: EventEmitter<ReturnValue<any>> = new EventEmitter<ReturnValue<any>>();
  form: FormGroup;
  get value() {
    return this.form.value;
  }
  constructor(
    private fb: FormBuilder,
  ) { }

  // OnInit
  ngOnInit() {
    this.form = this.createControl();
    // console.log(JSON.stringify(this.form));

    // Show all request
    this.validateAllFormFields(this.form);

    this.form.valueChanges.pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(data => {
        if (!this.form) { return; }
        this.submit.emit({
          value: this.form.getRawValue(),
          valid: this.form.valid
        });

        if (!this.form.valid) {
          this.validateAllFormFields(this.form);
        }
      });
  }
  // on Submit
  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.form.valid) {
      this.submit.emit({ value: this.form.getRawValue(), valid: true });
    } else {
      this.validateAllFormFields(this.form);
    }
  }
  // createControl
  createControl() {
    const group = this.fb.group({});
    this.fields.forEach(field => {
      if (field.type === "button") return;
      const control = this.fb.control(
        { value: field.value, disabled: field.disabled},
        this.bindValidations(field.validations || [])
      );
      group.addControl(field.name, control);
    });
    return group;
  }
  // bindValidations
  bindValidations(validations: any) {
    if (validations.length > 0) {
      const validList = [];
      validations.forEach(valid => {
        validList.push(valid.validator);
      });
      return Validators.compose(validList);
    }
    return null;
  }
  // validateAllFormFields
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  // Filter group
  filterField(groupName?: string) {
    if (groupName) {
      return this.fields.filter(x => x.group === groupName);
    }
  }
}
