import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";
import { Subscription } from 'rxjs';
import { ShareService } from '../../share.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-select",
  template: `
  <mat-form-field [formGroup]="group" class="app-select">
    <mat-select [placeholder]="field.label" [formControlName]="field.name">
      <mat-option *ngFor="let item of field.options" [value]="item.value" style="margin-left:5px;">
        {{item.label}}
      </mat-option>
    </mat-select>
    <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
      <mat-error *ngIf="group.get(field.name).hasError(validation.name)">
        {{validation.message}}
      </mat-error>
    </ng-container>
  </mat-form-field>
`,
  styles: [`
 .app-select {
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
    .app-select {
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
export class SelectComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  subscription: Subscription;

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
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSendToParent(name?: any): void {
    //debug here
    this.serviceShared.toParent({ name: name });
  }
}
