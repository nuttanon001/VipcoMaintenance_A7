import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";

@Component({
  selector: "app-radiobutton",
  template: `
  <div [formGroup]="group" class="app-radiobutton" [ngClass]="{'show-vertival': field.vertival }">
  <label class="radio-label-padding">{{field.label}}:</label>
  <mat-radio-group [formControlName]="field.name">
    <mat-radio-button *ngFor="let item of field.options" [value]="item.value" style="margin-left:5px;">
      {{item.label}}
    </mat-radio-button>
  </mat-radio-group>
  </div>
`,
  styles: [`
 .app-radiobutton {
    width: 95%;
    margin: 5px;
    display: flex;
    align-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-flow: row;
  }

  .radio-label-padding {
    padding-right: 10px;
    color: grey;
  }

  .show-vertival
  {
    flex-flow: column;
  }

`]
})
export class RadiobuttonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  constructor() { }
  ngOnInit() { }
}
