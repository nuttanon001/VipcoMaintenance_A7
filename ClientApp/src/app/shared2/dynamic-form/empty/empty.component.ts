import { Component, OnInit } from '@angular/core';
import { FieldConfig } from '../field-config.model';

@Component({
  selector: 'app-empty',
  template: `
  <div class="app-empty">
  </div>
  `,
  styles: [`
 .app-empty {
    width: 45%;
  }

  @media(max-width: 600px)
  {
    .app-empty {
      width:100%;
    }
  }
`]
})
export class EmptyComponent implements OnInit {
  field: FieldConfig;

  constructor() { }
  ngOnInit() { }
}
