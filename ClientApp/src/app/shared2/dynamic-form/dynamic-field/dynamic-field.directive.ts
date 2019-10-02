import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnInit,
  ViewContainerRef,  EventEmitter,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { InputComponent } from "../input/input.component";
import { ButtonComponent } from "../button/button.component";
import { SelectComponent } from "../select/select.component";
import { DateComponent } from "../date/date.component";
import { RadiobuttonComponent } from "../radiobutton/radiobutton.component";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { InputClickComponent } from "../input/input-click.component";
import { TextAreaComponent } from "../text-area/text-area.component";
import { DateEventComponent } from '../date/date-event.component';
import { FieldConfig } from "../field-config.model";
import { AutoCompleteComponent } from '../input/auto-complete.component';
import { EmptyComponent } from '../empty/empty.component';

const componentMapper = {
  input: InputComponent,
  inputclick: InputClickComponent,
  textarea: TextAreaComponent,
  button: ButtonComponent,
  select: SelectComponent,
  date: DateComponent,
  dateevent: DateEventComponent,
  radiobutton: RadiobuttonComponent,
  checkbox: CheckboxComponent,
  autocomplete: AutoCompleteComponent,
  empty:EmptyComponent
};

@Directive({
  selector: "[dynamicField]"
})
export class DynamicFieldDirective implements OnInit {
  @Input() field: FieldConfig;
  @Input() group: FormGroup;
  // Output

  componentRef: any;
  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    const factory = this.resolver.resolveComponentFactory(
      componentMapper[this.field.type]
    );
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.group = this.group;
  }
}
