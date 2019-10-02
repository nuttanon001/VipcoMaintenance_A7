import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";

// Component
@Component({
  selector: "app-date",
  template: `
  <mat-form-field [formGroup]="group" class="app-date">
    <input matInput [matDatepicker]="picker" [formControlName]="field.name" [placeholder]="field.label" [readonly]="field.readonly">
    <mat-datepicker-toggle matSuffix [for]="picker" [disabled]="field.readonly"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
    <mat-hint></mat-hint>

    <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
      <mat-error *ngIf="group.get(field.name).hasError(validation.name)">
        {{validation.message}}
      </mat-error>
    </ng-container>
  </mat-form-field>
`,
  styles: [`
  .app-date
  {
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
    .app-date
    {
      margin: 5px;
      width:100%;

      mat-form-field {
        width: 90%;
        min-height:50px;
        margin:5px;
      }
    }
  }
`]
})
export class DateComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }
  ngOnInit() { }
}
