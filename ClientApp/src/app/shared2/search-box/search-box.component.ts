import {
  Component, OnInit, Input,
  Output, EventEmitter, ElementRef, 
} from "@angular/core";

// by importing just the rxjs operators we need, We're theoretically able
// to reduce our build size vs. importing all of them.
import { Observable, fromEvent } from "rxjs";
import { map,debounceTime,distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "search-box2",
  template: `
    <mat-form-field>
        <input id="search-box1" type="text" matInput
               placeholder="Search here..." maxlength="50" autofocus
               [(ngModel)]="setInput">
    </mat-form-field>
    <mat-checkbox [disabled]="isDisabled" class="w-50"
                  [(ngModel)]="isOnlyCreate" (change)="onCondition($event)">
        Filter Only User
    </mat-checkbox>
  `
})
export class SearchBox2Component implements OnInit {
  @Input() isDisabled: boolean = true;
  @Input() isOnlyCreate: boolean = false;
  @Input() setInput: string;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Output() onlyCreate: EventEmitter<boolean> = new EventEmitter<boolean>();

  search2: string;
  onlyCreate2: boolean;

  constructor() {}

  ngOnInit(): void {
    if (this.isOnlyCreate) {
      this.onlyCreate2 = this.isOnlyCreate;
    } else {
      this.onlyCreate2 = false;
    }

    const el = document.getElementById("search-box1");
    // convert the `keyup` event into an observable stream
    fromEvent(el, 'input').pipe(
      debounceTime(350),
      distinctUntilChanged(),
      map((e: any) => {
        // debug here
        //console.log(e.target.value);
        return e.target.value;
      }),
     ).subscribe( //extract the value of the input
      (results: any) => {
        // debug here
        //console.log(results);

        this.search2 = results;
        this.search.emit(this.search2);
      });
  }

  // on More Codition
  onCondition(event?: any): void {
    // console.log("on Condition :", event);
    this.onlyCreate2 = event.checked;
    this.onlyCreate.emit(event.checked);
  }
}
