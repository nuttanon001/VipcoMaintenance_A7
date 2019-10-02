import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Module
import { CustomMaterialModule } from './customer-material.module';
// Component
import { CheckboxComponent } from './dynamic-form/checkbox/checkbox.component';
import { DateComponent } from './dynamic-form/date/date.component';
import { InputComponent } from './dynamic-form/input/input.component';
import { SelectComponent } from './dynamic-form/select/select.component';
import { RadiobuttonComponent } from './dynamic-form/radiobutton/radiobutton.component';
import { ButtonComponent } from './dynamic-form/button/button.component';
import { DynamicFieldDirective } from './dynamic-form/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form/dynamic-form/dynamic-form.component';
import { InputClickComponent } from './dynamic-form/input/input-click.component';
import { TextAreaComponent } from ".//dynamic-form/text-area/text-area.component";
import { DynamicGroupFormComponent } from './dynamic-form/dynamic-group-form/dynamic-group-form.component';
import { DateEventComponent } from './dynamic-form/date/date-event.component';
import { AutoCompleteComponent } from './dynamic-form/input/auto-complete.component';
import { EmptyComponent } from './dynamic-form/empty/empty.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
  ],
  declarations: [
    CheckboxComponent,
    DateComponent,
    DateEventComponent,
    InputComponent,
    InputClickComponent,
    SelectComponent,
    RadiobuttonComponent,
    ButtonComponent,
    TextAreaComponent,
    DynamicFormComponent,
    DynamicGroupFormComponent,
    DynamicFieldDirective,
    AutoCompleteComponent,
    EmptyComponent,
  ],
  exports: [
    DynamicFormComponent,
    DynamicGroupFormComponent,
    DynamicFieldDirective
  ],
  entryComponents: [
    CheckboxComponent,
    DateComponent,
    DateEventComponent,
    InputComponent,
    InputClickComponent,
    SelectComponent,
    RadiobuttonComponent,
    ButtonComponent,
    TextAreaComponent,
    AutoCompleteComponent,
    EmptyComponent,
  ]
})

export class SharedModule { }
