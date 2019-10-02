import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";
// Component
@Component({
  selector: "app-checkbox",
  template: `
  <span class="app-checkbox" [formGroup]="group">
    <mat-checkbox [formControlName]="field.name">
      {{field.label}}
    </mat-checkbox>
  </span>
`,
  styles: [`
  .app-checkbox
    {
      width: 45%;
      margin: 10px;
    }
`]
})
export class CheckboxComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }
  ngOnInit() { }

  /*
   .app-checkbox
    {
      display: flex;
      flex-wrap: wrap;
      justify-content: left;
      flex-flow: row;
      margin: 5px;
    }
  .show-vertival
    {
      flex-flow: column;
    }
   */
}
