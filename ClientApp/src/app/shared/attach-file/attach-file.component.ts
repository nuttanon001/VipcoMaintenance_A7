import {
  Component, OnInit,
  Output, EventEmitter,
  ElementRef
} from "@angular/core";
// by importing just the rxjs operators we need, We"re theoretically able
// to reduce our build size vs. importing all of them.
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switch";

@Component({
  selector: 'app-attach-file',
  template: `
    <input name="attachFile" type="file" class="m-0 p-0 form-control-file form-control-sm" multiple />
  `
})
export class AttachFileComponent implements OnInit {
  @Output() results: EventEmitter<FileList> = new EventEmitter<FileList>();
  /** attact-file ctor */
  constructor(private el: ElementRef) { }

  /** Called by Angular after attact-file component initialized */
  ngOnInit(): void {
    // debug here
    // console.log("Here Attach");
    // convert the `keyup` event into an observable stream
    Observable.fromEvent(this.el.nativeElement, "change")
      .debounceTime(250) // only once every 250ms
      .subscribe((file: any) => {
        // debug here
        // console.log("Files:", file);
        this.results.emit(file.target.files);
      });
  }
}
