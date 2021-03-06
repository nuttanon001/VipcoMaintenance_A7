import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from "../field-config.model";
import { ShareService } from '../../share.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Component
@Component({
  selector: "app-date-event",
  template: `
  <mat-form-field [formGroup]="group" class="app-date-event">
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
  .app-date-event
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
    .app-date-event
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
export class DateEventComponent implements OnInit,OnDestroy {
  field: FieldConfig;
  group: FormGroup;

  constructor(
    private serviceShared: ShareService
  ) { }
  ngOnInit() {
    this.group.get(this.field.name).valueChanges
      .pipe(debounceTime(500),distinctUntilChanged())
      .subscribe((data: any) => this.onValueChanged(data));
  }

  ngOnDestroy() { }

  onValueChanged(value?: any): void {
    //debug here
    this.serviceShared.toParent({ name: this.field.name,value: value });
  }
}
