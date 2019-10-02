import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";
import { Subscription, Observable } from "rxjs";
import { ShareService } from "../../share.service";
import { filter, startWith, map } from "rxjs/operators";

@Component({
  selector: 'app-auto-complete',
  template: `
    <mat-form-field [formGroup]="group" class="app-auto-complete">
    <input matInput [formControlName]="field.name" [placeholder]="field.label"
                    [type]="field.inputType" [readonly]="field.readonly"
                    [matAutocomplete]="auto">

    <mat-autocomplete #auto="matAutocomplete">
      <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
        {{option}}
      </mat-option>
    </mat-autocomplete>

    <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
      <mat-error *ngIf="group.get(field.name).hasError(validation.name)">
        {{validation.message}}
      </mat-error>
    </ng-container>
  </mat-form-field>
  `,
  styles: [`
 .app-auto-complete {
    width: 45%;
    margin: 5px;

    mat-form-field {
      width: 90%;
      min-height:50px;
      margin:5px;
    }
  }

  @media(max-width: 600px)
  {
    .app-auto-complete {
      width:100%;
      margin: 5px;

      mat-form-field {
        width: 90%;
        min-height:50px;
        margin:5px;
      }
    }
  }
`]
})
export class AutoCompleteComponent implements OnInit {

  field: FieldConfig;
  group: FormGroup;
  subscription: Subscription;
  options: Array<string>;
  filteredOptions: Observable<string[]>;
  constructor(
    private serviceShared: ShareService
  ) { }
  ngOnInit() {
    this.subscription = this.serviceShared.toChild$.pipe(filter((item) => this.field.name == item.name)).
      subscribe(item => {
        // console.log(item);
        // Patch Value
        if (this.field.continue) {
          const value = this.group.get(this.field.name).value;
          this.group.get(this.field.name).patchValue((value ? value + "," : "") + item.value);
        } else {
          this.group.get(this.field.name).patchValue(item.value);
        }
      });

    // Set field.options to options (string array)
    this.options = new Array;
    if (this.field.options) {
      this.options = this.field.options.map(item => {
        return item.value;
      }).slice();
    }

    this.filteredOptions = this.group.get(this.field.name).valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  // field.options
  // Filter for auto completed
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // Destroy
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
