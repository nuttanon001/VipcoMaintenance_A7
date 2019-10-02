import { Component, OnInit, OnDestroy } from '@angular/core';
import { FieldConfig } from '../field-config.model';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ShareService } from '../../share.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-text-area',
  template: `
 <mat-form-field [formGroup]="group" class="app-text-area">
    <textarea matInput [formControlName]="field.name" [placeholder]="field.label" [readonly]="field.readonly">
    </textarea>
    <ng-container *ngFor="let validation of field.validations;" ngProjectAs="mat-error">
      <ng-container *ngIf="validation">
        <mat-error *ngIf="group.get(field.name).hasError(validation.name)">
          {{validation.message}}
        </mat-error>
      </ng-container>
    </ng-container>
  </mat-form-field>
  `,
  styles: [`
 .app-text-area {
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
    .app-text-area
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
export class TextAreaComponent implements OnInit, OnDestroy {
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
}
